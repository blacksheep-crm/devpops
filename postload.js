//vanilla postload content
if (typeof (SiebelAppFacade.Postload) == "undefined") {
    Namespace('SiebelAppFacade.Postload');

    (function () {
        SiebelApp.EventManager.addListner("postload", OnPostload, this);
        function OnPostload() {
            try {
                //console.log("Loaded");
            }
            catch (error) {
                //No-Op
            }
        }
    }());
}
//end of vanilla postload content

//blacksheep devpops
//EDUCATIONAL SAMPLE!!! DO NOT USE IN PRODUCTION!!!
//copy below code to vanilla postload.js for a quick demo and validation
//MOVE TO CUSTOM FILES BEFORE DEPLOYING
//search for " * CODE SEPARATION" ca. line 130 for details

//START workspace-helper*******************************************************************

//globals, keep in postload.js
var bcrm_meta = {};

//get data from custom BO for Web Tools display of who else is editing an object definition
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMWSGetModData = function (cell) {
    bcrm_meta = {};
    bcrm_meta.wot = $(cell).attr("wot");
    bcrm_meta.wrn = $(cell).attr("wrn");
    var cl = $(cell);

    //get only Edit-In-Progress workspaces
    var url = location.origin + "/siebel/v1.0/data/BCRM Modified Object/BCRM Modified Object" + "?uniformresponse=Y&searchspec=" + "[Object Name]=\"" + bcrm_meta.wrn + "\" AND [Workspace Editable Flag]='Y' AND [Object Type]=\"" + bcrm_meta.wot + "\"";
    var settings = {
        "url": url,
        "method": "GET",
        "timeout": 0,
        "headers": {
            //"Authorization": "Basic U0FETUlOOlNpZWJlbDE5"
        },
    };

    $.ajax(settings).done(function (response) {
        //console.log(response);
        cl.find(".bcrm-dev-avatar").remove();
        for (var i = 0; i < response.items.length; i++) {
            //create "avatar" icon with tool tip for each entry
            var ava = $("<div class='bcrm-dev-avatar' style='color:white;width:15px;height:15px;background:orange;border-radius:50%;line-height:15px;float:left;margin-right:2px'>");
            ava.attr("title", response.items[i]["User Name"] + " is editing in " + response.items[i]["Workspace Name"] + "/" + response.items[i]["Workspace Version"]);
            ava.text(response.items[i]["User Name"].substring(0, 1));
            cl.append(ava);
            cl.attr("style", "background:coral!important;text-align:center;");
        }
    });
}

//workspace-helper
//DRAFT and unsupported: Enhance tools list applet
//add click handler to "Writable" column
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMWebToolsHighlight = function (pm) {
    if (typeof (pm) === "undefined") {
        pm = this;
    }
    if (pm && pm.Get) {
        //get Object Type from Object Explorer
        var ot = $(".siebui-wt-objexp-tree").find(".fancytree-active").text();

        var rown, row, fid, ph, rs, ae, cell, od;
        rown = 0;
        fid = pm.Get("GetFullId");
        ph = pm.Get("GetPlaceholder");
        ae = $("#s_" + fid + "_div");
        rs = pm.Get("GetRawRecordSet");
        for (r in rs) {
            od = {};
            rown = parseInt(r) + 1;
            od.wot = ot;
            od.wrn = rs[r]["Name"];
            row = ae.find("tr[id='" + rown + "']");
            cell = row.find("td[id='" + rown + "_" + ph + "_Writable']");
            cell.off("click");
            cell.attr(od);
            row.on("click", function () {
                var rown = $(this).attr("id");
                var ph = $(this).parent().parent().attr("id");
                var cell = $(this).find("td[id='" + rown + "_" + ph + "_Writable']");
                BCRMWSGetModData(cell);
            });
            cell.css("cursor", "pointer");
        }
    }
};

//workspace-helper
//DRAFT and unsupported: Enhance tools list applet
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMWebToolsEnhancer = function () {
    //DRAFT: grab the main list applet
    var pm = SiebelApp.S_App.GetActiveView().GetActiveApplet().GetPModel();
    pm.AttachPMBinding("ShowSelection", BCRMWebToolsHighlight, { scope: pm, sequence: true });
    BCRMWebToolsHighlight(pm);
};

//main postload function for Web Tools
BCRMWTHelper = function () {
    try {
        //enhance Web Tools
        if (SiebelApp.S_App.GetAppName() == "Siebel Web Tools") {
            BCRMWebToolsEnhancer();
            console.log("BCRM devpops extension for Siebel Web Tools loaded");
        }
    }
    catch (e) {
        console.log("Error in BCRMWTHelper: " + e.toString());
    }
};
try {
    if (location.pathname.indexOf("webtools") > -1) {
        SiebelApp.EventManager.addListner("postload", BCRMWTHelper, this);
    }
}
catch (e) {
    console.log("Error in BCRM devpops extension for Siebel Web Tools: " + e.toString());
}

//END WSTOOLS postload.js content


/*************************************************************************************************************************************
 * CODE SEPARATION
 * Everything below this comment can be moved to a separate, custom JS file.
 * Example:
 * Keep content above this comment in vanilla postload.js
 * Move content below this comment to <siebelwebroot>/scripts/siebel/custom/devpops.js
 * Create Manifest File registration: siebel/custom/devpops.js
 * Register in Manifest Administration with Application/Common/PLATFORM INDEPENDENT
 *************************************************************************************************************************************/
//blacksheep devpops
//EDUCATIONAL SAMPLE!!! DO NOT USE IN PRODUCTION!!!

//TODO: Debug Menu sequence
//Issue: Fast inspect does not appear to support inspecting new Views.
//Done: Auto-refresh cache when new view is detected (Check for Screen object type in workspace, most likely had a screen view update)
//Fast Inspect loses the context of the record whereas the traditional method does not. (SWE Params?)
//Almost done: use history.back as it seems to be the most stable for now

BCRMCustomizeDebugMenu = function () {
    //put your menu customizations here
    //visit the BCRMCreateDebugMenu method to see pre-defined menu items
    //Example:
    /*
    //set override flag for menu item always
    BCRM_MENU["Silent"].override = true;
    //override properties, e.g. disable menu
    BCRM_MENU["Silent"].enable = false;

    //custom label
    BCRM_MENU["ShowBCFields"].override = true;
    BCRM_MENU["ShowBCFields"].label = "BC Layer";
    */

    //new item (copy one from BCRMCreateDebugMenu function and modify)
    /*
    BCRM_MENU["GotoView2"] = {
        "seq": 101,
        "enable": localStorage.getItem("BCRM_MENU_ENABLE_GotoView2") == "false" ? false : true,
        "label": "Change Position",
        "title": "Go to Change Position View",
        "onclick": function () {
            var r = BCRMCloseDebugMenu();
            SiebelApp.S_App.GotoView("Change Position View");
            return r;
        },
        "img": "images/grid_matte_boxes.png"
    };
    */
};

//globals
var defs = [];
var dt = [];
var trace_raw;
var trace_parsed;
var trace_norr;
var devpops_dver = "21.3.xxvii";
var devpops_version = 50;
var devpops_tag = "Wilhelm Conrad Röntgen";
var devpops_uv = 0;
var devpops_vcheck = false;
var BCRCMETACACHE = {};
var BCRM_SIEBEL_VERSION = "";
var BCRM_SIEBEL_V = {};
var BCRM_WORKSPACE = {};
var FWK_VERSION = 0;

//module configuration, most defaults and other stuff can be controlled from here
var devpops_config = {
    ses_home: "C:\\Siebel\\ses\\siebsrvr"
};

//workspace-helper
//get list of workspaces via REST
BCRMGetWorkspaceList = function () {
    var pagesize = 100;
    var url = location.origin + "/siebel/v1.0/data/BCRM%20Modified%20Object/BCRM%20Modified%20Object?uniformresponse=Y&childlinks=none&fields=Workspace%20Name,%20Workspace%20Version,Workspace%20Latest%20Version,Workspace%20Status,%20Object%20Name&PageSize=" + pagesize;
    var items = [];
    var ws = {};
    var wsn, wsv, wss;
    var cd = $.ajax({
        dataType: "json",
        url: url,
        async: false
    });
    if (typeof (cd.responseJSON.items) !== "undefined") {
        items = cd.responseJSON.items;
        for (var i = 0; i < items.length; i++) {
            wsn = items[i]["Workspace Name"];
            wsv = items[i]["Workspace Version"];
            wss = items[i]["Workspace Status"];
            wsl = items[i]["Workspace Latest Version"];
            if (typeof (ws[wsn]) === "undefined") {
                ws[wsn] = {};
            }
            if (typeof (ws[wsn]["Versions"]) === "undefined") {
                ws[wsn]["Versions"] = [];
            }
            if (ws[wsn]["Versions"].indexOf(wsv) == -1) {
                ws[wsn]["Versions"].push(wsv);
            }
            if (typeof (ws[wsn]["Status"]) === "undefined") {
                ws[wsn]["Status"] = wss;
            }
            if (typeof (ws[wsn]["Latest"]) === "undefined") {
                ws[wsn]["Latest"] = wsl;
            }
        }
    }
    return ws;
}

//workspace-helper
//create Workspace banner
BCRMWSGenerateWSBanner = function (ws, ver, status, type) {
    if (typeof (type) === "undefined") {
        type = "banner";
    }
    var u, w, v, s;
    var c = $('<div id="bcrm_wsui_name" class="siebui-active-ws" style="margin-right: 4px;background:transparent!important;"></div>');
    if (type == "banner") {
        u = $('<ul class="siebui-wsui-ctx-bar">');
    }
    else {
        u = $('<div class="siebui-wsui-ctx-bar">');
    }

    var cl = "";
    var st = "";
    switch (status) {
        case "Created": cl = "siebui-wsui-created"; st = "Writable"; break;
        case "Edit-In-Progress": cl = "siebui-wsui-edit-in-progress"; st = "Writable"; break;
        case "Delivered": cl = "siebui-wsui-delivered"; st = "Read-Only"; break;
        case "Checkpointed": cl = "siebui-wsui-checkpointed"; st = "Writable"; break;
        case "Submitted for Delivery": cl = "siebui-wsui-submitted-for-delivery"; st = "Read-Only"; break;
        default: cl = "siebui-wsui-delivered"; st = "Read-Only"; break;
    }
    if (ws == "MAIN") {
        st = "Read-Only";
    }
    if (type == "banner") {
        w = $('<li class="siebui-wsui-ctx-wsname"><span class="siebui-label">Workspace:</span> <span class="siebui-value">' + ws + '</span></li>');
        v = $('<li class="siebui-wsui-ctx-wsver"><span class="siebui-label">Version:</span> <span class="siebui-value">' + ver + '</span></li>');
        s = $('<li class="siebui-wsui-ctx-wsstatus"><span class="siebui-label">Status:</span> <span class="siebui-value">' + st + '</span></li>');
    }
    else {
        w = $('<div class="siebui-wsui-ctx-wsname"><span class="siebui-label">Workspace:</span> <span class="siebui-value">' + ws + '</span></div>');
        s = $('<div class="siebui-wsui-ctx-wsstatus"><span class="siebui-label">Status:</span> <span class="siebui-value">' + st + '</span></div>');
    }

    u.addClass(cl);
    c.attr("title", status + " (" + st + ")");
    u.append(w);
    if (type == "banner") {
        u.append(v);
    }
    u.append(s);
    c.append(u);
    return c;
};

//workspace-helper
//Re-enact workspace banner in application until there's a better way
BCRMWSUpdateWSBanner = function (ws, ver, status) {
    $("div.applicationMenu").parent().find("#bcrm_wsui_name").remove();
    var c = BCRMWSGenerateWSBanner(ws, ver, status, "banner");
    $("div.applicationMenu").after(c);
    if (!(BCRM_WORKSPACE.WS == sessionStorage.BCRMCurrentWorkspace && BCRM_WORKSPACE.VER == sessionStorage.BCRMCurrentWorkspaceVersion)) {
        c.on("dblclick", function () {
            BCRMWSFastInspect(sessionStorage.BCRMCurrentWorkspace, sessionStorage.BCRMCurrentWorkspaceVersion, sessionStorage.BCRMCurrentWorkspaceStatus);
        });
        c.attr("title", c.attr("title") + "\nDouble-click to reload");
    }
};

//workspace-helper
//Open and inspect workspace
BCRMWSFastInspectHandler = function (cell) {
    bcrm_meta = {};
    bcrm_meta.wsn = $(cell).attr("wsn");
    bcrm_meta.wsv = $(cell).attr("wsv");
    bcrm_meta.wss = $(cell).attr("wss");
    BCRMWSFastInspect(bcrm_meta.wsn, bcrm_meta.wsv, bcrm_meta.wss);
};

//workspace-helper
//fast inspect main function (calls server side BS)

BCRMWSFastInspect = function (ws, ver, status) {
    var vn = SiebelApp.S_App.GetActiveView().GetName();
    var loc = location;
    var vreload = true;
    if (vn == "Business Service Test View") {
        vreload = false;
    }
    var tview = "User Profile Behavior View";
    var svc = SiebelApp.S_App.GetService("FWK Runtime");
    var ips = SiebelApp.S_App.NewPropertySet();
    var ops = SiebelApp.S_App.NewPropertySet();
    ips.SetProperty("WorkspaceName", ws);
    ips.SetProperty("WorkspaceVersion", ver);
    if (vreload) {
        SiebelApp.S_App.GotoView(tview);
    }

    setTimeout(function () {
        ops = svc.InvokeMethod("FastInspect", ips);

        if (ops.GetProperty("Status") == "OK") {
            //BCRMWSUpdateWSBanner(ws, ver, status);
            sessionStorage.BCRMCurrentWorkspace = ws;
            sessionStorage.BCRMCurrentWorkspaceVersion = ver;
            sessionStorage.BCRMCurrentWorkspaceStatus = status;
            if (vreload) {
                //check for Screen update, which indicates a likely new view
                try {
                    var url = location.origin + "/siebel/v1.0/data/BCRM Modified Object/BCRM Modified Object?uniformresponse=Y&searchspec=[Object Type]=\"Screen\" AND [Workspace Name]=\"" + sessionStorage.BCRMCurrentWorkspace + "\"";
                    var cd = $.ajax({
                        dataType: "json",
                        url: url,
                        async: false
                    });
                    if (cd.responseJSON.items && cd.responseJSON.items.length > 0) {
                        sessionStorage.BCRMReloadCache = "Y";
                    }
                }
                catch (e) {
                    //do nothing
                }
                //gotoview does not keep context, error when trying to add query parms
                //SiebelApp.S_App.GotoView(vn,null,loc.search);
                //SiebelApp.S_App.GotoView(vn);
                //history seems to do the trick, but some views might not be in history
                history.back();
                //simple location reload causes errors
                //location.href = hr;
            }
            else {
                location.reload();
            }
            BCRMWSUpdateWSBanner(ws, ver, status);
            //check for screen updates
        }
    }, 300);
};

//Auto cache refresh
BCRMReloadCache = function () {
    try {
        if (sessionStorage.BCRMReloadCache == "Y") {
            $("#bcrm_debug_msg").text("Stand by for cache refresh");
            $("#bcrm_debug_msg").css("color", "red");
            $("#bcrm_debug_msg").css("font-weight", "bold");
            $("#maskoverlay").show();
            setTimeout(function () {
                BCRMClearCaches(true);
                sessionStorage.BCRMReloadCache = "N";
                setTimeout(function () {
                    $("#bcrm_debug_msg").text("");
                }, 3000);
            }, 500);
        }
    }
    catch (e) {
        //do nothing
    }
}
//workspace-helper
//read workspace data for modified object list applet
BCRMWSGetObjectDef = function (cell) {
    bcrm_meta = {};
    bcrm_meta.wot = $(cell).attr("wot");
    bcrm_meta.wsn = $(cell).attr("wsn");
    bcrm_meta.wsv = $(cell).attr("wsv");
    bcrm_meta.wrn = $(cell).attr("wrn");

    //need to get workspace/version data for given object
    var url = location.origin + "/siebel/v1.0/workspace/*/" + bcrm_meta.wot + "/*?workspace=" + bcrm_meta.wsn + "&version=" + bcrm_meta.wsv + "&searchspec=[Name]=\"" + bcrm_meta.wrn + "\"";
    var settings = {
        "url": url,
        "method": "GET",
        "timeout": 0,
        "headers": {
            //"Authorization": "Basic U0FETUlOOlNpZWJlbDE5"
        },
    };

    $("#maskoverlay").show();
    $.ajax(settings).done(function (response) {
        //repair response links
        //expansion example
        var temp = response;
        for (var i = 0; i < temp.Link.length; i++) {
            if (temp.Link[i].rel == "child") {
                var href = temp.Link[i].href;
                href += "/?uniformresponse=Y&workspace=" + bcrm_meta.wsn + "&version=" + bcrm_meta.wsv;
                temp.Link[i].href = href;

                //DRAFT: expansion example for applet controls and bs server scripts
                if ((bcrm_meta.wot == "Applet" && temp.Link[i].name == "Control") ||
                    (bcrm_meta.wot == "Business Service" && temp.Link[i].name == "Business Service Server Script")
                ) {
                    var cd = $.ajax({
                        dataType: "json",
                        url: href,
                        async: false
                    });
                    if (typeof (cd.responseJSON.items) !== "undefined") {
                        temp.Link[i].items = cd.responseJSON.items;
                    }
                }
            }
        }
        response = temp;

        //create simple dialog with codemirror (should be part of vanilla siebel)
        var value = JSON.stringify(response, null, 4);
        var dtitle = "<h3>" + bcrm_meta.wot + ":" + bcrm_meta.wrn + " [" + bcrm_meta.wsn + "/" + bcrm_meta.wsv + "]</h3>";
        var cm = $("<div id='bcrm_cm'>");
        defs.push(value);
        dt.push(dtitle);
        var dlg = $("<div style='overflow:auto;'>");
        dlg.append(dtitle);
        dlg.append(cm);

        $("#maskoverlay").hide();

        dlg.dialog({
            title: "Object Metadata",
            width: 800,
            height: 600,
            close: function (e, ui) {
                $(this).dialog("destroy");
            }
        });
        setTimeout(function () {
            CodeMirror($("#bcrm_cm")[0], {
                value: value,
                mode: "json",
                lineNumbers: true
            });
        }, 100);

        //if the second item has been clicked, open a comparison window
        if (defs.length == 2) {
            BCRMCompare(defs.pop(), defs.pop());
        }
    });
};

//workspace-helper
//in this DRAFT(!!) we simply compare the last two defs that have been clicked
//requires mergely
BCRMCompare = function (right, left) {
    var wrap = $("<div id='bcrm_compare_wrapper'><div id='bcrm-compare-left-title' style='width:50%;float:left;'></div><div id='bcrm-compare-right-title' style='width:50%;float:left;'></div></div>");
    $("#compare2").remove();
    $("#_sweview").append(wrap);
    wrap.append("<div id='compare2'>");
    $("#bcrm-compare-right-title").html(dt.pop());
    $("#bcrm-compare-left-title").html(dt.pop());

    $("#compare2").mergely({
        cmsettings: {
            readOnly: false,
            lineWrapping: true
        },
        wrap_lines: true,

        //Doesn't do anything?
        autoresize: true,

        editor_width: 'calc(50% - 25px)',
        editor_height: '100%',

        lhs: function (setValue) {
            setValue(left);
        },
        rhs: function (setValue) {
            setValue(right);
        }
    });
};

//workspace-helper
//enhance modified objects list applet with clickable object name and WS/Version column
BCRMWSEnhancer = function (pm) {
    if (typeof (pm) === "undefined") {
        pm = this;
    }
    if (pm && pm.Get) {
        var row, fid, ph, rs, ae, cell, od, wsmsg;
        row = 0;
        fid = pm.Get("GetFullId");
        ph = pm.Get("GetPlaceholder");
        ae = $("#s_" + fid + "_div");
        rs = pm.Get("GetRawRecordSet");
        for (r in rs) {
            od = {};
            row = parseInt(r) + 1;
            od.wot = rs[r]["Object Type"];
            od.wrn = rs[r]["Object Name"];
            od.wsn = rs[r]["Workspace Name"];
            od.wsv = rs[r]["Workspace Version"];
            od.wss = rs[r]["Workspace Status"];

            cell = ae.find("td[id='" + row + "_" + ph + "_Object_Name']");

            cell.off("click");
            cell.attr(od);
            cell.on("click", function () {
                BCRMWSGetObjectDef(this);
            });
            cell.attr("bcrm-enhanced", "true");
            cell.css("color", "blue");
            cell.css("cursor", "pointer");
            cell.attr("title", "Click to view repository metadata for " + od.wot + " : " + od.wrn);

            cell = ae.find("td[id='" + row + "_" + ph + "_Workspace_Name']");

            cell.off("dblclick");
            cell.attr(od);
            cell.on("dblclick", function () {
                BCRMWSFastInspectHandler(this);
            });
            cell.attr("bcrm-enhanced", "true");
            cell.css("color", "darkgreen");
            cell.css("cursor", "zoom-in");
            wsmsg = od.wsn + "/" + od.wsv + " (" + od.wss + ")";
            cell.attr("title", "Double-click to Open and Inspect Workspace " + wsmsg);
        }
    }
};

//workspace-helper
//Create Workspace Menu
BCRMCreateWSMenu = function (data) {
    var key, val, wsn, wss, wsl, ver;
    //additional formatting by Jason
    var ul_main = $("<ul ul style='width:min-content;text-align:left;background:whitesmoke;z-index:10000;' class='depth-0'></ul>");
    for (d in data) {
        wsn = d;
        wss = data[d]["Status"];
        wsl = data[d]["Latest"];
        ver = data[d]["Versions"];
        //val = data[d];
        var li = $("<li class='bcrm-li' wss='" + wss + "' wsv='" + wsl + "' wsn='" + wsn + "' style='cursor:pointer;float:left;margin-right:200px;margin-left:4px;margin-bottom:2px;'></li>");
        var dv = BCRMWSGenerateWSBanner(wsn, wsl, wss, "menu");
        li.append(dv);
        var ul = $("<ul class='depth-1' style='width: min-content;text-align: left;'>");
        for (var i = 0; i < ver.length; i++) {
            key = ver[i];
            var lisub = $("<li class='bcrm-lisub' style='cursor:pointer;background: grey;width: 24px;height: 24px;margin: 4px;line-height: 1.7;text-align: center;font-size: 1.2em; padding: 1px; border-radius: 4px;' wsv='" + key + "' wsn='" + wsn + "' wss='" + wss + "'><div style='padding-left:4px;color:white'>" + key + "</div></li>");
            ul.append(lisub);
        }
        ul.appendTo(li);
        li.appendTo(ul_main);
    }
    ul_main.find("li.bcrm-lisub").on("click", function () {
        BCRMWSFastInspect($(this).attr("wsn"), $(this).attr("wsv"), $(this).attr("wss"));
        $("#bcrm_ws_menu").remove();
    });
    ul_main.find("li.bcrm-li").on("click", function () {
        BCRMWSFastInspect($(this).attr("wsn"), $(this).attr("wsv"), $(this).attr("wss"));
        $("#bcrm_ws_menu").remove();
    });
    return ul_main;
};

//workspace-helper
//Right-click on Dashboard icon (cube)
BCRMWSIconEnhancer = function () {
    if ($("#SiebComposerConfig").length == 1) {
        $("#SiebComposerConfig").attr("style", "transition: background-color 1.5s ease-in-out 1s;");
        $("#SiebComposerConfig").attr("style", "transition: background-color 1.5s ease-in-out 1s;background-color: mediumseagreen;");
        setTimeout(function () {
            $("#SiebComposerConfig").attr("style", "transition: background-color 1.5s ease-in-out 1s;");
        }, 5000);
        if ($("#SiebComposerConfig").attr("bcrm-enhanced") != "true") {
            $("#SiebComposerConfig").attr("bcrm-enhanced", "true");

            $("#SiebComposerConfig").attr("title", "Right-click to see menu of recent workspaces and versions for fast inspection");
            $("#SiebComposerConfig").on("contextmenu", function (e) {
                var ws = BCRMGetWorkspaceList();
                if ($("#bcrm_ws_menu").length == 0) {
                    var mc = $("<div id='bcrm_ws_menu'></div>");
                    var menu = BCRMCreateWSMenu(ws);
                    mc.append(menu);
                    //$("#_sweclient").append(mc);
                    $($("#SiebComposerConfig").find("div")[0]).after(mc);
                    $("#bcrm_ws_menu").find("ul.depth-0").menu({
                        position: { my: "left top", at: "right-5 top+5" },
                        create: function (e, ui) {
                            var myright = $(this)[0].getClientRects()[0].right;
                            var maxright = window.innerWidth;
                            if (myright > maxright) {
                                $(this).css("right", "24px");
                            }
                        }
                    });
                }
                else {
                    $("#bcrm_ws_menu").remove();
                }
                return false;
            });
        }
    }
};
//END workspace-helper****************************************************

//START devpops Menu******************************************************
//devpops MenuCreate Debugger Menu

//helper for SARM timestamps
BCRMSARMTimeStamp = function (dt) {
    var r = "";
    r += dt.getFullYear();
    r += "-";
    r += (dt.getMonth() + 1) < 10 ? "0" + (dt.getMonth() + 1) : (dt.getMonth() + 1);
    r += "-";
    r += dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate();
    r += " ";
    r += dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours();
    r += ":";
    r += dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes();
    r += ":";
    r += dt.getSeconds() < 10 ? "0" + dt.getSeconds() : dt.getSeconds();
    return r;
};

BCRMCloseDebugMenu = function () {
    if ($("#bcrm_dbg_menu").hasClass("ui-draggable")) {
        return false;
    }
    else {
        $("#bcrm_dbg_menu").find("ul.depth-0").menu("destroy");
        return true;
    }
};

//such Personalization, much wow
BCRMEditDebugMenu = function () {
    var t;
    var def = true;
    for (i in BCRM_MENU) {
        if (!BCRM_MENU[i].enable && !BCRM_MENU[i].override) {
            $("li#" + i).show();
            def = false;
        }
        else {
            def = true;
        }
        t = $("<span class='bcrm-dbg-edit' style='margin-right:4px;'><input id='" + i + "' type='checkbox'></span>");
        t.find("input").prop("checked", def);
        t.find("input").on("click", function (e, ui) {
            var v = $(this).prop("checked");
            var i = $(this).attr("id");
            e.stopImmediatePropagation();
            BCRM_MENU[i].enable = v;
            var ls = "BCRM_MENU_ENABLE_" + i;
            if (v) {
                localStorage.setItem(ls, "true");
            }
            else {
                localStorage.setItem(ls, "false");
            }
        });
        $($("li#" + i).find("div")[0]).prepend(t);
    }
    $("#bcrm_dbg_menu").find("ul").css("width", "270px");
};

BCRMStopEditDebugMenu = function () {
    $("span.bcrm-dbg-edit").remove();
    $("#bcrm_dbg_menu").find("ul").css("width", "auto");
    $("#bcrm_bed").show();
    $("#bcrm_beds").hide();
    for (i in BCRM_MENU) {
        if (!BCRM_MENU[i].enable) {
            $("li#" + i).hide();
        }
    }
};

BCRMButtonizeDebugMenu = function () {
    var m;
    var adjust = false;
    BCRMStopEditDebugMenu();
    if (!$("#bcrm_dbg_menu").hasClass("ui-draggable")) {
        adjust = true;
        $("#bcrm_dbg_menu").draggable();
        $("#bcrm_dbg_tb").css("cursor", "move");
        $("#bcrm_bcls").show();
    }
    $("#bcrm_dtch").hide();
    $("#bcrm_bed").hide();
    $("#bcrm_rot").hide();
    $("#bcrm_ug").hide();

    for (i in BCRM_MENU) {
        m = BCRM_MENU[i].seq;
        var dv = $($("li#" + i).find("div")[0]);
        var tsp = null;
        //dv.text(m);
        dv.attr("title", BCRM_MENU[i].label + "\n" + dv.attr("title"));
        $("li#" + i).find("span").hide();
        if (typeof (BCRM_MENU[i].img) !== "undefined") {
            var imgurl = BCRM_MENU[i].img;
            if (dv.find("span").length >= 1) {
                tsp = $(dv.find("span")[0]).detach();
            }
            else {
                tsp = null;
            }
            dv.text("");
            if (tsp != null) {
                dv.append(tsp);
            }
            var ost = dv.attr("style");
            var nst = ost + " " + "background-image:url(" + imgurl + ")!important;"
            nst = nst + "background-size:cover!important;";
            dv.attr("style", nst);
            dv.css("height", "36px");
            dv.css("width", "36px");
            dv.css("margin-top", "1px");
            dv.css("padding-bottom", "0px");
        }
        $("li#" + i).on("contextmenu", function () {
            if ($(this).find("button[id^='options']").length > 0) {
                $(this).find("button[id^='options']").click();
            }
            else {
                $(this).find("span").show();
                $(this).find("span").addClass("bcrm-autohide");
                $(this).find("span").attr("style", "background: #29303f;padding: 2px 4px 2px 4px;position: relative;top: 31px;border-bottom-left-radius: 10px;border-bottom-right-radius: 10px;left: -3px;");
                $(this).find("input[type='checkbox']").hide();

                setTimeout(function () {
                    $(".bcrm-autohide").hide();
                    $(".bcrm-autohide").removeClass("bcrm-autohide");
                }, 5000);
            }
            return false;
        })
    }
    $("#bcrm_dbg_menu ul").css("display", "flex");
    $("#bcrm_dbg_menu ul").find("li").width(40);
    $("#bcrm_dbg_menu ul").find("li").css("text-align", "center");
    if (adjust) {
        var r = $("#bcrm_dbg_menu ul")[0].getBoundingClientRect().right;
        var w = window.innerWidth;
        var newl = -1 * (r - w);
        $("#bcrm_dbg_menu ul").css("left", newl.toString() + "px");
    }
    $("#bcrm_dbg_menu ul").addClass("bcrm-tb");
};

var BCRM_MENU;
BCRM_MENU = {};

BCRMCreateDebugMenu = function () {
    var togglecss = ".bcrm-dock-ug:before{content:'\\f004';font-family:'oracle';} .bcrm-dock-rot:before{content:'\\e94a';font-family:'oracle';} #bcrm_dbg_menu ul.bcrm-tb li.bcrm-dbg-item div.ui-state-disabled {background-size: cover!important;mix-blend-mode: soft-light;} .bcrm-dock-edit:before{content:'\\e634';font-family:'oracle'} .bcrm-dock-save:before{content:'\\e691';font-family:'oracle'} .bcrm-dock-close:before{content:'\\e63a';font-family:'oracle'} .bcrm-dock-toggle-pin:before{ content: '\\e6cf';font-family:'oracle'} label.bcrm-toggle-label:after {content: '';	position: absolute;	top: 1px;	left: 1px;	width: 13px; height: 13px;background: #fff;	border-radius: 90px;	transition: 0.3s;}input.bcrm-toggle:checked + label {	background: #489ed6!important;}input.bcrm-toggle:checked + label:after {	left: calc(100% - 1px);	transform: translateX(-100%);}";
    var st = $("<style bcrm-style='yes'>" + togglecss + "</style>");
    if ($("style[bcrm-style]").length == 0) {
        $("head").append(st);
    }
    if (typeof (BCRM_MENU["ShowControls"]) === "undefined") {
        BCRM_MENU = {
            "ShowControls": {
                "seq": 1,
                "enable": localStorage.getItem("BCRM_MENU_ENABLE_ShowControls") == "false" ? false : true,
                "label": "XR Show Controls",
                "title": "X-Ray: Toggle Form Applets to display Control information in labels",
                "onclick": function (e, ui) {
                    if (!$(this).hasClass("ui-state-disabled")) {
                        var am = SiebelApp.S_App.GetActiveView().GetAppletMap();
                        var ut = new SiebelAppFacade.BCRMUtils();
                        ut.RemoveLinkOverlay();
                        for (a in am) {
                            ut.ShowControls(a);
                        }
                        sessionStorage.BCRMToggleCycle = "ShowControls";
                        if ($("#bcrm_dbg_menu").hasClass("ui-draggable")) {
                            $($("li#ShowControls").find("div")[0]).addClass("ui-state-disabled");
                            $($("li#ShowBCFields").find("div")[0]).removeClass("ui-state-disabled");
                            $($("li#ShowTableColumns").find("div")[0]).removeClass("ui-state-disabled");
                            $($("li#Reset").find("div")[0]).removeClass("ui-state-disabled");
                        }
                    }
                    return BCRMCloseDebugMenu();
                },
                "showtoggle": true,
                "img": "images/grid_matte_webpagesearch.png"
            },
            "ShowBCFields": {
                "seq": 2,
                "enable": localStorage.getItem("BCRM_MENU_ENABLE_ShowBCFields") == "false" ? false : true,
                "label": "XR Show BC Fields",
                "title": "X-Ray: Toggle Form and List Applets to display BC Field information in labels",
                "onclick": function () {
                    if (!$(this).hasClass("ui-state-disabled")) {
                        var am = SiebelApp.S_App.GetActiveView().GetAppletMap();
                        var ut = new SiebelAppFacade.BCRMUtils();
                        ut.RemoveLinkOverlay();
                        for (a in am) {
                            ut.ShowBCFields(a);
                        }
                        ut.LinkOverlay();
                        sessionStorage.BCRMToggleCycle = "ShowBCFields";
                        if ($("#bcrm_dbg_menu").hasClass("ui-draggable")) {
                            $($("li#ShowControls").find("div")[0]).removeClass("ui-state-disabled");
                            $($("li#ShowBCFields").find("div")[0]).addClass("ui-state-disabled");
                            $($("li#ShowTableColumns").find("div")[0]).removeClass("ui-state-disabled");
                            $($("li#Reset").find("div")[0]).removeClass("ui-state-disabled");
                        }
                    }
                    return BCRMCloseDebugMenu();
                },
                "showtoggle": true,
                "img": "images/grid_matte_barcode.png"
            },
            "ShowTableColumns": {
                "seq": 3,
                "enable": localStorage.getItem("BCRM_MENU_ENABLE_ShowTableColumns") == "false" ? false : true,
                "label": "XR Show Columns",
                "title": "X-Ray: Toggle Form and List Applets to display physical layer information",
                "onclick": function () {
                    if (!$(this).hasClass("ui-state-disabled")) {
                        var am = SiebelApp.S_App.GetActiveView().GetAppletMap();
                        var ut = new SiebelAppFacade.BCRMUtils();
                        ut.RemoveLinkOverlay();
                        for (a in am) {
                            ut.ShowTableColumns(a);
                        }
                        sessionStorage.BCRMToggleCycle = "ShowTableColumns";
                        if ($("#bcrm_dbg_menu").hasClass("ui-draggable")) {
                            $($("li#ShowControls").find("div")[0]).removeClass("ui-state-disabled");
                            $($("li#ShowBCFields").find("div")[0]).removeClass("ui-state-disabled");
                            $($("li#ShowTableColumns").find("div")[0]).addClass("ui-state-disabled");
                            $($("li#Reset").find("div")[0]).removeClass("ui-state-disabled");
                        }
                    }
                    return BCRMCloseDebugMenu();
                },
                "showtoggle": true,
                "img": "images/grid_matte_book.png"
            },
            "Reset": {
                "seq": 4,
                "enable": localStorage.getItem("BCRM_MENU_ENABLE_Reset") == "false" ? false : true,
                "label": "XR Reset Labels",
                "title": "X-Ray: Toggle Form and List Applets to display original labels",
                "onclick": function () {
                    if (!$(this).hasClass("ui-state-disabled")) {
                        var am = SiebelApp.S_App.GetActiveView().GetAppletMap();
                        var ut = new SiebelAppFacade.BCRMUtils();
                        ut.RemoveLinkOverlay();
                        for (a in am) {
                            ut.LabelReset(a);
                        }
                        sessionStorage.BCRMToggleCycle = "Reset";
                        if ($("#bcrm_dbg_menu").hasClass("ui-draggable")) {
                            $($("li#ShowControls").find("div")[0]).removeClass("ui-state-disabled");
                            $($("li#ShowBCFields").find("div")[0]).removeClass("ui-state-disabled");
                            $($("li#ShowTableColumns").find("div")[0]).removeClass("ui-state-disabled");
                            $($("li#Reset").find("div")[0]).addClass("ui-state-disabled");
                        }
                    }
                    return BCRMCloseDebugMenu();
                },
                "img": "images/grid_matte_cycle_rtl.png"
            },
            "Silent": {
                "seq": 5,
                "enable": localStorage.getItem("BCRM_MENU_ENABLE_Silent") == "false" ? false : true,
                "label": "XR Silent Mode",
                "title": "X-Ray: Complete scan, update tooltips only",
                "onclick": function () {
                    $("#bcrm_debug_msg").text("X-Ray silent scan running, please wait...");
                    setTimeout(function () {
                        if (!$("#bcrm_dbg_menu").hasClass("ui-draggable")) {
                            $("#bcrm_dbg_menu").remove();
                        }
                        BCRMdevpopsTest("xray");
                        $("#bcrm_debug_msg").text("X-Ray silent scan complete. Check tooltips.");
                        setTimeout(function () {
                            $("#bcrm_debug_msg").text("");
                        }, 5000);
                        //$("#bcrm_dbg_menu").find("ul.depth-0").menu("destroy");
                        return BCRMCloseDebugMenu();
                    }, 200);
                    return BCRMCloseDebugMenu();
                },
                "img": "images/grid_matte_ship.png"
            },
            "StartTracing": {
                "seq": 6,
                "enable": localStorage.getItem("BCRM_MENU_ENABLE_StartTracing") == "false" ? false : true,
                "label": "Start Tracing",
                "title": "Start SQL/Allocation Tracing\nKudos to Jason",
                "onclick": function () {
                    if (!$(this).hasClass("ui-state-disabled")) {
                        BCRMStartLogging();
                        sessionStorage.BCRMTracingCycle = "StartTracing";
                        if ($("#bcrm_dbg_menu").hasClass("ui-draggable")) {
                            $($("li#StopTracing").find("div")[0]).removeClass("ui-state-disabled");
                            $($("li#StartTracing").find("div")[0]).addClass("ui-state-disabled");
                        }
                        var r = BCRMCloseDebugMenu();
                        var msg = "<span>Tracing in progress</span><button  style='margin-left: 10px;background: #97cff3;border: 0px;cursor: pointer;border-radius: 10px;'>" + "Stop'n'View" + "</button>";
                        $("#bcrm_debug_msg").html(msg);
                        $("#bcrm_debug_msg").find("button").on("click", function (e) {
                            BCRMStopLogging();
                            sessionStorage.BCRMTracingCycle = "StopTracing";
                            if ($("#bcrm_dbg_menu").hasClass("ui-draggable")) {
                                $($("li#StopTracing").find("div")[0]).addClass("ui-state-disabled");
                                $($("li#StartTracing").find("div")[0]).removeClass("ui-state-disabled");
                            }
                            $("#bcrm_debug_msg").text("");
                            BCRMViewLog();
                        });
                        return r;
                    }
                    else {
                        return BCRMCloseDebugMenu();
                    }
                },
                "showoptions": true,
                "options": {
                    "FilePath": {
                        "label": "File Path",
                        "default": devpops_config.ses_home + "\\temp\\",
                        "tip": "Enter a valid server path (without file name)",
                        "type": "input"
                    },
                    "RetainFile": {
                        "label": "Retain File",
                        "default": "false",
                        "tip": "Retain (true) or delete (false) trace file after retrival",
                        "type": "select",
                        "lov": ["true", "false"]
                    },
                    "TraceType": {
                        "label": "Trace Type",
                        "default": "SQL",
                        "tip": "Trace Type: SQL or Allocation",
                        "type": "select",
                        "lov": ["SQL", "Allocation"]
                    },
                    "TraceEvents": {
                        "label": "Additional Event Tracing",
                        "default": "none",
                        "tip": "Inject trace comments for application events.",
                        "type": "select",
                        "lov": ["none", "Presentation Model"]
                    },
                    "SlowQuery": {
                        "label": "Slow Query Threshold (ms)",
                        "default": "100",
                        "tip": "Show slow query stats for queries that run longer than this.",
                        "type": "input"
                    }
                },
                "img": "images/grid_matte_decline_rtl.png"
            },
            "ViewTracing": {
                "seq": 7,
                "enable": localStorage.getItem("BCRM_MENU_ENABLE_ViewTracing") == "false" ? false : true,
                "label": "View Trace File",
                "title": "View SQL/Allocation Trace File\nKudos to Jason",
                "onclick": function () {
                    BCRMViewLog();
                    return BCRMCloseDebugMenu();
                },
                "img": "images/grid_matte_financialinformation.png"
            },
            "StopTracing": {
                "seq": 8,
                "enable": localStorage.getItem("BCRM_MENU_ENABLE_StopTracing") == "false" ? false : true,
                "label": "Stop Tracing",
                "title": "Stop SQL/Allocation Tracing\nKudos to Jason",
                "onclick": function () {
                    if (!$(this).hasClass("ui-state-disabled")) {
                        BCRMStopLogging();
                        sessionStorage.BCRMTracingCycle = "StopTracing";
                        if ($("#bcrm_dbg_menu").hasClass("ui-draggable")) {
                            $($("li#StopTracing").find("div")[0]).addClass("ui-state-disabled");
                            $($("li#StartTracing").find("div")[0]).removeClass("ui-state-disabled");
                        }
                        $("#bcrm_debug_msg").text("");
                    }
                    return BCRMCloseDebugMenu();
                },
                "img": "images/grid_matte_forklift.png"
            },
            "BSRunner": {
                "seq": 21,
                "enable": localStorage.getItem("BCRM_MENU_ENABLE_BSRunner") == "false" ? false : true,
                "label": "Service Runner",
                "title": "meep meep",
                "onclick": function () {
                    BCRMBusinessServiceRunner();
                    return BCRMCloseDebugMenu();
                },
                "img": "images/grid_matte_generic.png"
            },
            "GotoView1": {
                "seq": 9,
                "enable": localStorage.getItem("BCRM_MENU_ENABLE_GotoView1") == "false" ? false : true,
                "label": "Go to Modified Objects View",
                "title": "View and compare object definitions (DR Only)",
                "onclick": function () {
                    var r = BCRMCloseDebugMenu();
                    SiebelApp.S_App.GotoView("BCRM Modified Objects List View");
                    return r;
                },
                "img": "images/grid_matte_persongrid.png"
            },
            "ClearCaches": {
                "seq": 10,
                "enable": localStorage.getItem("BCRM_MENU_ENABLE_ClearCaches") == "false" ? false : true,
                "label": "Clear Caches",
                "title": "Clear RTE, LOV and Responsibility Cache\n(c)xapuk.com",
                "onclick": function () {
                    BCRMClearCaches();
                    return BCRMCloseDebugMenu();
                },
                "img": "images/grid_matte_crystalball.png"
            },
            "AboutView": {
                "seq": 11,
                "enable": localStorage.getItem("BCRM_MENU_ENABLE_AboutView") == "false" ? false : true,
                "label": "About View",
                "title": "Same, but on steroids ;-)\n(c)xapuk.com",
                "onclick": function () {
                    var r = BCRMCloseDebugMenu();
                    try {
                        BCRMSiebelAboutView();
                    }
                    catch (e) {
                        //nothing
                    }
                    return r;
                },
                "img": "images/grid_matte_message.png"
            },
            "ScriptEditor": {
                "seq": 12,
                "enable": localStorage.getItem("BCRM_MENU_ENABLE_ScriptEditor") == "false" ? false : true,
                "label": "eScript Playground",
                "title": "Test eScript from the comfort of your browser\n(c)xapuk.com",
                "onclick": function () {
                    BCRMScriptEditor();
                    return BCRMCloseDebugMenu();
                },
                "img": "images/grid_matte_scroll_rtl.png"
            },
            "ExprEditor": {
                "seq": 13,
                "enable": localStorage.getItem("BCRM_MENU_ENABLE_ExprEditor") == "false" ? false : true,
                "label": "Expression Playground",
                "title": "Test Siebel Query Language Expressions from the comfort of your browser\n(c)xapuk.com",
                "onclick": function () {
                    var r = BCRMCloseDebugMenu();
                    try {
                        BCRMExprEditor();
                    }
                    catch (e) {
                        //nothing
                    }
                    return r;
                },
                "img": "images/grid_matte_scales.png"
            },
            "srvrmgr": {
                "seq": 14,
                "enable": localStorage.getItem("BCRM_MENU_ENABLE_srvrmgr") == "false" ? false : true,
                "label": "Server Manager",
                "title": "Run Siebel Server Manager Commands (experimental)",
                "onclick": function () {
                    $("body").css("cursor", "wait");
                    BCRMSrvrMgr();
                    $("body").css("cursor", "");
                    return BCRMCloseDebugMenu();
                },
                "acl": ["Siebel Administrator"],
                "img": "images/grid_matte_plan.png"
            },
            "serverstatus": {
                "seq": 15,
                "enable": localStorage.getItem("BCRM_MENU_ENABLE_serverstatus") == "false" ? false : true,
                "label": "Server Status",
                "title": "Show Server Component Status via REST API (experimental)",
                "onclick": function () {
                    var r = BCRMCloseDebugMenu();
                    BCRMDisplayServer();
                    return r;
                },
                "img": "images/grid_matte_piechart.png"
            },
            "StartSARM": {
                "seq": 16,
                "enable": localStorage.getItem("BCRM_MENU_ENABLE_StartSARM") == "false" ? false : true,
                "label": "Start SARM",
                "title": "Start SARM logging",
                "onclick": function () {
                    if (!$(this).hasClass("ui-state-disabled")) {
                        BCRMSARMOn();
                        sessionStorage.BCRMSARMCycle = "StartSARM";
                        if ($("#bcrm_dbg_menu").hasClass("ui-draggable")) {
                            $($("li#StartSARM").find("div")[0]).addClass("ui-state-disabled");
                            $($("li#StopSARM").find("div")[0]).removeClass("ui-state-disabled");
                        }
                        var r = BCRMCloseDebugMenu();
                        var msg = "<span id='bcrm_sarm_msg'>Logging SARM data for 300 seconds</span><button  style='margin-left: 10px;background: #97cff3;border: 0px;cursor: pointer;border-radius: 10px;'>" + "Stop Now" + "</button>";
                        $("#bcrm_debug_msg").html(msg);
                        $("#bcrm_debug_msg").find("button").on("click", function (e) {
                            BCRMSARMOff();
                            sessionStorage.BCRMSARMCycle = "StopSARM";
                            if ($("#bcrm_dbg_menu").hasClass("ui-draggable")) {
                                $($("li#StartSARM").find("div")[0]).removeClass("ui-state-disabled");
                                $($("li#StopSARM").find("div")[0]).addClass("ui-state-disabled");
                            }
                            clearInterval(sarmintv);
                            $("#bcrm_debug_msg").text("");
                        });
                        return r;
                    }
                    else {
                        return BCRMCloseDebugMenu();
                    }
                },
                "acl": ["Siebel Administrator"],
                "showoptions": true,
                "options": {
                    "FilePath": {
                        "label": "File Path",
                        "default": devpops_config.ses_home + "\\temp",
                        "tip": "Enter a valid server path (without file name)",
                        "type": "input"
                    },
                    "Component": {
                        "label": "Component Alias",
                        "default": "sccobjmgr_enu",
                        "tip": "Select component alias",
                        "type": "select",
                        "lov": ["sccobjmgr_enu", "eaiobjmgr_enu", "sseobjmgr_enu", "ecommunicationsobjmgr_enu", "wfprocmgr", "xmlpreportserver"]
                    },
                    "Server": {
                        "label": "Siebel Server",
                        "default": "server01",
                        "tip": "Select Siebel Server",
                        "type": "select",
                        "lov": ["server01", "server02"]
                    },
                    "Duration": {
                        "label": "Duration (min 60 seconds)",
                        "default": "300",
                        "tip": "Stop SARM logging after time has elapsed",
                        "type": "number",
                        "min": 60
                    }
                },
                "img": "images/grid_matte_video.png"
            },
            "StopSARM": {
                "seq": 17,
                "enable": localStorage.getItem("BCRM_MENU_ENABLE_StopSARM") == "false" ? false : true,
                "label": "Stop SARM",
                "title": "Stop SARM logging",
                "onclick": function () {
                    if (!$(this).hasClass("ui-state-disabled")) {
                        BCRMSARMOff();
                        clearInterval(sarmintv);
                        sessionStorage.BCRMSARMCycle = "StopSARM";
                        if ($("#bcrm_dbg_menu").hasClass("ui-draggable")) {
                            $($("li#StartSARM").find("div")[0]).removeClass("ui-state-disabled");
                            $($("li#StopSARM").find("div")[0]).addClass("ui-state-disabled");
                        }
                        $("#bcrm_debug_msg").text("");
                    }
                    return BCRMCloseDebugMenu();
                },
                "acl": ["Siebel Administrator"],
                "img": "images/grid_matte_trophy.png"
            },
            "ShowSARM": {
                "seq": 18,
                "enable": localStorage.getItem("BCRM_MENU_ENABLE_ShowSARM") == "false" ? false : true,
                "label": "Show SARM Stats",
                "title": "Very limited demo, knock yourself out",
                "onclick": function () {
                    var r = BCRMCloseDebugMenu();
                    BCRMShowSARM();
                    return r;
                },
                "showoptions": true,
                "options": {
                    "GroupBy": {
                        "label": "Group By",
                        "default": "area",
                        "tip": "Aggregation level",
                        "type": "select",
                        "lov": ["area", "subarea", "workflow"]
                    },
                    "Type": {
                        "label": "Output Type",
                        "default": "chart",
                        "tip": "Output type",
                        "type": "select",
                        "lov": ["chart", "classic"]
                    },
                    "StartTime": {
                        "label": "Start Time",
                        //default time range: last 10 minutes
                        "default": BCRMSARMTimeStamp(new Date(new Date() - 600000)),
                        "tip": "Start Time Filter",
                        "type": "input"
                    },
                    "EndTime": {
                        "label": "End Time",
                        "default": BCRMSARMTimeStamp(new Date(new Date() + 600000)),
                        "tip": "End Time Filter",
                        "type": "input"
                    }

                },
                "acl": ["Siebel Administrator"],
                "img": "images/grid_matte_gantt.png"
            },
            "freeform": {
                "seq": 19,
                "enable": localStorage.getItem("BCRM_MENU_ENABLE_freeform") == "false" ? false : true,
                "label": "Break free!",
                "title": "Liberate form applets from table layout. Enjoy...",
                "onclick": function () {
                    var r = BCRMCloseDebugMenu();
                    var rwd = new SiebelAppFacade.BCRMRWDFactory();
                    var am = SiebelApp.S_App.GetActiveView().GetAppletMap();
                    var ut = new SiebelAppFacade.BCRMUtils();
                    for (a in am) {
                        if (ut.GetAppletType(a) == "form") {
                            rwd.BCRMMakeGridResponsive(a);
                        }
                    }
                    return r;
                },
                "img": "images/grid_matte_formwrench.png"
            },
            "SiebelHub": {
                "seq": 20,
                "enable": localStorage.getItem("BCRM_MENU_ENABLE_SiebelHub") == "false" ? false : true,
                "label": "Siebel Hub",
                "title": "Get your Siebel kicks on da hub with a random page (might require login).",
                "onclick": function () {
                    var hub = [
                        "https://www.siebelhub.com/main/siebel-crm-training/siebel-20-21-workshop",
                        "https://www.siebelhub.com/main/siebel-crm-training",
                        "https://www.siebelhub.com/main/bsl",
                        "https://www.siebelhub.com/main/books-media/siebel-crm-timeline",
                        "https://www.siebelhub.com/main/product-category/siebel_20_21_workshop/overview/update-summaries",
                        "https://www.siebelhub.com/main/product/siebel-crm-20-21-blue-book",
                        "https://www.youtube.com/playlist?list=PL8ytufPqZPFHWvrqqZVRmRELuqOJoyKKY",
                        "https://www.youtube.com/playlist?list=PL8ytufPqZPFEyhv4Nj5ZghltdfxvV5esI",
                        "https://www.siebelhub.com/main/blog",
                        "https://www.siebelhub.com/main/2021/01/learn-siebel-crm-21-with-the-siebel-hub.html"
                    ];
                    window.open(hub[Math.floor((Math.random() * hub.length))]);
                    return BCRMCloseDebugMenu();
                },
                "img": "images/grid_matte_megaphone.png"
            },
            "devpops": {
                "seq": 21,
                "enable": localStorage.getItem("BCRM_MENU_ENABLE_devpops") == "false" ? false : true,
                "label": "devpops " + devpops_dver,
                "title": "devpops " + devpops_dver + " (" + devpops_tag + ")\nSiebel Version: " + BCRM_SIEBEL_VERSION + "\nLearn more about blacksheep-crm devpops and contribute on github.",
                "onclick": function () {
                    window.open("https://github.com/blacksheep-crm/devpops");
                    return BCRMCloseDebugMenu();
                },
                "img": "images/grid_matte_puzzle.png"
            }
        };
    }

    BCRMCustomizeDebugMenu();

    var hasresp = true;
    var ul_main = $("<ul ul style='width: auto;text-align:left;background:#29303f;' class='depth-0'></ul>");

    //create small toolbar on top of menu
    //detach (done), rotate (done), config (enable/disable items (done), sequence items (TODO))
    var mtb = $("<li id='bcrm_dbg_tb' style='height:36px;padding:0 0 2px 4px;background:#808080'>");
    var dtch = $('<span id="bcrm_dtch" style="cursor:pointer;height:32px;float: right; margin-right: 6px;" title="Undock"><a class="bcrm-dock-toggle-pin" style="color:white;"></span>');
    var bcls = $('<span id="bcrm_bcls" style="cursor:pointer;display:none;height:32px;float: right; margin-right: 6px;" title="Close"><a class="bcrm-dock-close" style="color:white;"></span>');
    var bed = $('<span id="bcrm_bed" style="cursor:pointer;height:32px;float: right; margin-right: 6px;" title="Edit"><a class="bcrm-dock-edit" style="color:white;"></span>');
    var ug = $('<span id="bcrm_ug" style="cursor:pointer;height:32px;float: right; margin-right: 6px;" title="Help: User Guide"><a class="bcrm-dock-ug" style="color:white;"></span>');
    var beds = $('<span id="bcrm_beds" style="cursor:pointer;display:none;height:32px;float: right; margin-right: 6px;" title="Save"><a class="bcrm-dock-save" style="color:white;"></span>');
    var rot = $('<span id="bcrm_rot" style="cursor:pointer;height:32px;float: right; margin-right: 6px;" title="Rotate"><a class="bcrm-dock-rot" style="color:white;"></span>');
    dtch.on("click", function (e, ui) {
        $("#bcrm_dbg_menu").draggable();
        $("#bcrm_dbg_tb").css("cursor", "move");
        $("#bcrm_dbg_tb").append("<span id='bcrm_drag' style='font-size:0.8em;'>drag me</span>");
        setTimeout(function () {
            $("#bcrm_drag").remove();
        }, 3000);
        $("#bcrm_bcls").show();
        $(this).hide();
        return false;
    });
    bcls.on("click", function (e, ui) {
        $("#bcrm_dbg_menu").find("ul.depth-0").menu("destroy");
    });
    bed.on("click", function () {
        BCRMEditDebugMenu();
        $("#bcrm_beds").show();
        $(this).hide();
        return false;
    });
    beds.on("click", function () {
        BCRMStopEditDebugMenu();
        return false;
    });
    rot.on("click", function () {
        BCRMButtonizeDebugMenu();
        return false;
    });
    ug.on("click", function () {
        window.open("https://github.com/blacksheep-crm/devpops/blob/main/ug.pdf", "_blank");
        return false;
    })
    mtb.append(dtch);
    mtb.append(bcls);
    mtb.append(bed);
    mtb.append(beds);
    mtb.append(rot);
    mtb.append(ug);

    //main loop to create menu
    for (i in BCRM_MENU) {
        if (true) {
            var li = $("<li class='bcrm-dbg-item' id='" + i + "' style='height:32px;font-size:0.9em;font-family:cursive;margin-right:4px;margin-left:4px;margin-bottom:2px;'></li>");
            var dv = $("<div style='height:32px;padding-bottom:6px;' title='" + BCRM_MENU[i].title + "'>" + BCRM_MENU[i].label + "</div>");
            if (sessionStorage.BCRMToggleCycle == i || sessionStorage.BCRMTracingCycle == i || sessionStorage.BCRMSARMCycle == i) {
                dv.addClass("ui-state-disabled");
            }
            else if (typeof (sessionStorage.BCRMToggleCycle) === "undefined" && i == "Reset") {
                dv.addClass("ui-state-disabled");
            }
            else if (typeof (sessionStorage.BCRMTracingCycle) === "undefined" && i == "StopTracing") {
                dv.addClass("ui-state-disabled");
            }
            else if (typeof (sessionStorage.BCRMSARMCycle) === "undefined" && i == "StopSARM") {
                dv.addClass("ui-state-disabled");
            }

            dv.on("click", BCRM_MENU[i].onclick);

            if (i == "devpops") {
                if (devpops_uv > devpops_version) {
                    dv.css("color", "#14ca21");
                    dv.attr("title", "Updates available!\n" + dv.attr("title"));
                }
            }
            if (BCRM_MENU[i].acl) {
                var resps = BCRMGetResps();
                hasresp = false;
                for (var x = 0; x < BCRM_MENU[i].acl.length; x++) {
                    if (resps.indexOf(BCRM_MENU[i].acl[x]) > -1) {
                        hasresp = true;
                        break;
                    }
                }
                if (!hasresp) {
                    dv.addClass("ui-state-disabled");
                    dv.attr("title", "Access denied due to missing responsibilities\n" + dv.attr("title"));
                }
            }
            if (BCRM_MENU[i].showtoggle) {
                var tog = $('<span style="height:32px;float: right; margin-right: 6px;" title="Set/unset this toggle cycle as default"><input class="bcrm-toggle" style="height: 0;width: 0;visibility: hidden;" type="checkbox" id="toggle_' + i + '"><label class="bcrm-toggle-label" for="toggle_' + i + '" style="cursor: pointer;text-indent: -9999px;width: 35px;height: 15px;background: grey;display: inline-block;border-radius: 100px;position: relative;top: 12px;">Toggle</label></span>');
                $(tog).find("label").on("click", function (e, ui) {
                    e.stopImmediatePropagation();
                    var ip = $(this).attr("for");
                    $("input#" + ip).prop("checked", !$("input#" + ip).prop("checked"));
                    var checked = $("input#" + ip).prop("checked");
                    if (checked) {
                        sessionStorage.BCRM_TOGGLE_DEFAULT = ip.split("_")[1];
                        $("input.bcrm-toggle").each(function (x) {
                            if ($(this).attr("id") != ip && $(this).prop("checked")) {
                                $(this).prop("checked", false);
                            }
                        });
                        $("#bcrm_debug_msg").text("X-Ray default set to: " + ip.split("_")[1]);
                    }
                    else {
                        sessionStorage.BCRM_TOGGLE_DEFAULT = "";
                        $("#bcrm_debug_msg").text("");
                    }
                    return false;
                });
                dv.append(tog);
                if (sessionStorage.BCRM_TOGGLE_DEFAULT == i) {
                    tog.find("input").attr("bcrm-checked", "true");
                    setTimeout(function () {
                        $("input[bcrm-checked='true']").prop("checked", true);
                    }, 50)
                }
            }
            if (hasresp && BCRM_MENU[i].showoptions) {
                var opt = $('<span style="float: right; margin-right: 6px;height:32px;" title="Options"><span style="height:32px" class="miniBtnUIC"><button type="button" id="options_' + i + '" style="background: transparent;border: 0;" class="siebui-appletmenu-btn"><span style="height:32px;">Options</span></button></span></span>');
                $(opt).find("button").on("click", function (e, ui) {
                    var id = $(this).attr("id").split("_")[1];
                    var dlg = $("<div id='bcrm_options_dlg'>");
                    for (o in BCRM_MENU[id].options) {
                        var sn = "BCRM_OPT_" + id + "_" + o;
                        var opt = BCRM_MENU[id].options[o];
                        var oc = $("<div id='oc_" + o + "'>");
                        var lc = $("<div id='lc_" + o + "'>");
                        var ic;
                        if (opt.type == "input") {
                            ic = $("<input style='width: 220px;height: 20px;margin-bottom: 4px;font-size:14px;' class='bcrm-option' id='" + sn + "'>");
                        }
                        if (opt.type == "number") {
                            ic = $("<input type='number' style='width: 220px;height: 20px;margin-bottom: 4px;font-size:14px;' class='bcrm-option' id='" + sn + "'>");
                            if (opt.min) {
                                ic.attr("min", opt.min.toString());
                            }
                        }
                        if (opt.type == "select") {
                            ic = $("<select style='width: 220px;height: 20px;margin-bottom: 4px;font-size:14px' class='bcrm-option' id='" + sn + "' selected='" + opt.default + "'>");
                            for (var i = 0; i < opt.lov.length; i++) {
                                ic.append($("<option value='" + opt.lov[i] + "'>" + opt.lov[i] + "</option>"));
                            }
                        }
                        if (localStorage.getItem(sn) !== null) {
                            if (id == "ShowSARM") {
                                if (o == "StartTime" || o == "EndTime") {
                                    ic.val(opt.default);
                                }
                                else {
                                    ic.val(localStorage.getItem(sn));
                                }
                            }
                            else {
                                ic.val(localStorage.getItem(sn));
                            }
                        }
                        else {
                            ic.val(opt.default);
                        }
                        lc.text(opt.label);
                        ic.attr("title", opt.tip);
                        oc.append(lc);
                        oc.append(ic);
                        dlg.append(oc);
                    }
                    dlg.dialog({
                        title: BCRM_MENU[id].label + " Options",
                        buttons: {
                            "Save & Go": function () {
                                $("#bcrm_options_dlg").find(".bcrm-option").each(function (x) {
                                    var sn = $(this).attr("id");
                                    localStorage.setItem(sn, $(this).val());
                                });
                                if (id == "StartTracing") {
                                    BCRMStartLogging();
                                    sessionStorage.BCRMTracingCycle = "StartTracing";
                                    if ($("#bcrm_dbg_menu").hasClass("ui-draggable")) {
                                        $($("li#StopTracing").find("div")[0]).removeClass("ui-state-disabled");
                                        $($("li#StartTracing").find("div")[0]).addClass("ui-state-disabled");
                                    }
                                }
                                if (id == "StartSARM") {
                                    BCRMSARMOn();
                                    sessionStorage.BCRMSARMCycle = "StartSARM";
                                    if ($("#bcrm_dbg_menu").hasClass("ui-draggable")) {
                                        $($("li#StartSARM").find("div")[0]).addClass("ui-state-disabled");
                                        $($("li#StopSARM").find("div")[0]).removeClass("ui-state-disabled");
                                    }
                                }
                                if (id == "ShowSARM") {
                                    BCRMShowSARM();
                                }
                                $(this).dialog("destroy");
                                if (!$("#bcrm_dbg_menu").hasClass("ui-draggable")) {
                                    $("#bcrm_dbg_menu").remove();
                                }
                                if (id == "StartTracing") {
                                    var msg = "<span>Tracing in progress</span><button  style='margin-left: 10px;background: #97cff3;border: 0px;cursor: pointer;border-radius: 10px;'>" + "Stop'n'View" + "</button>";
                                    $("#bcrm_debug_msg").html(msg);
                                    $("#bcrm_debug_msg").find("button").on("click", function (e) {
                                        BCRMStopLogging();
                                        if ($("#bcrm_dbg_menu").hasClass("ui-draggable")) {
                                            $($("li#StopTracing").find("div")[0]).addClass("ui-state-disabled");
                                            $($("li#StartTracing").find("div")[0]).removeClass("ui-state-disabled");
                                        }
                                        sessionStorage.BCRMTracingCycle = "StopTracing";
                                        $("#bcrm_debug_msg").text("");
                                        BCRMViewLog();
                                    });
                                }
                                if (id == "StartSARM") {
                                    var msg = "<span id='bcrm_sarm_msg'>Logging SARM data for 300 seconds</span><button  style='margin-left: 10px;background: #97cff3;border: 0px;cursor: pointer;border-radius: 10px;'>" + "Stop Now" + "</button>";
                                    $("#bcrm_debug_msg").html(msg);
                                    $("#bcrm_debug_msg").find("button").on("click", function (e) {
                                        BCRMSARMOff();
                                        if ($("#bcrm_dbg_menu").hasClass("ui-draggable")) {
                                            $($("li#StartSARM").find("div")[0]).removeClass("ui-state-disabled");
                                            $($("li#StopSARM").find("div")[0]).addClass("ui-state-disabled");
                                        }
                                        clearInterval(sarmintv);
                                        sessionStorage.BCRMSARMCycle = "StopSARM";
                                        $("#bcrm_debug_msg").text("");
                                    });
                                }
                            },
                            Save: function () {
                                $("#bcrm_options_dlg").find(".bcrm-option").each(function (x) {
                                    var sn = $(this).attr("id");
                                    localStorage.setItem(sn, $(this).val());
                                });
                                $(this).dialog("destroy");
                            },
                            Cancel: function (e, ui) {
                                $(this).dialog("destroy");
                            }
                        }
                    });
                    return false;
                });
                dv.append(opt);
            }
            li.append(dv);
            li.appendTo(ul_main);
            if (!BCRM_MENU[i].enable) {
                li.hide();
            }
        }
    }
    ul_main.prepend(mtb);
    return ul_main;
};

//devpops Add debug button
BCRMAddDebugButton = function () {
    var next_to = $("#SiebComposerConfig");
    //var next_to = $("#siebui-toolbar-settings");
    if ($("#bcrm_debug").length == 0) {
        var btn = $('<div id="bcrm_debug" class="siebui-banner-btn siebui-toolbar-toggle-script-debugger"><ul class="siebui-toolbar"><li class="siebui-toolbar-enable" role="menuitem" title="blacksheep devpops is a Siebel Community effort"><span class="siebui-icon-tb-toggle_script_debugger ToolbarButtonOn"><span class="siebui-toolbar-text">BCRM Debugger</span></span></li></ul></div>');
        if (next_to.length == 1) {
            $(next_to).parent().before(btn);
        }
        //add contextmenu as per Jason suggestion
        $(btn.find("li")[0]).on("click contextmenu", function (e) {
            if ($("#bcrm_dbg_menu").length == 0) {
                var mc = $("<div id='bcrm_dbg_menu' style='position: relative;min-width: 240px;'></div>");
                var menu = BCRMCreateDebugMenu();
                mc.append(menu);
                $(this).prepend(mc);
                $("#bcrm_dbg_menu").find("ul.depth-0").menu({
                    create: function (e, ui) {
                        var myright = $(this)[0].getClientRects()[0].right;
                        var maxright = window.innerWidth;
                        if (myright > maxright) {
                            $(this).parent().css("right", "200px");
                        }
                    }
                });
            }
            else {
                $("#bcrm_dbg_menu").remove();
            }
            return false;
        });
    }
    //add message area
    if ($("#bcrm_debug_msg").length == 0) {
        var ms = $('<div id="bcrm_debug_msg" style="float: left;margin-top: 10px;padding-left: 20px;color: lightsteelblue;width: fit-content;">');
        $(".applicationMenu").after(ms);
        $("#bcrm_debug_msg").text("BCRM devpops loaded. Let's crush some bugs!");
        setTimeout(function () {
            $("#bcrm_debug_msg").text("");
        }, 5000);
    }
};
//END devpops Menu******************************************************

//START TRACE FILE VIEWER by Jason MacZura******************************
//courtesy of Jason MacZura: view trace file in browser
BCRMViewLog = function () {
    var fp, rf;
    if (typeof (localStorage.BCRM_OPT_StartTracing_FilePath) !== "undefined") {
        fp = localStorage.BCRM_OPT_StartTracing_FilePath;
    }
    else {
        fp = devpops_config.ses_home + "\\temp\\";
    }
    if (typeof (localStorage.BCRM_OPT_StartTracing_RetainFile) !== "undefined") {
        rf = localStorage.BCRM_OPT_StartTracing_RetainFile;
    }
    else {
        rf = "false";
    }
    var jm_myOutput = "";
    var jm_service = SiebelApp.S_App.GetService("FWK Runtime");
    var jm_ps = SiebelApp.S_App.NewPropertySet();
    jm_ps.SetProperty("Operation", "ViewLog");
    jm_ps.SetProperty("RetainFile", rf);
    jm_ps.SetProperty("FilePath", fp);
    var jm_outps = jm_service.InvokeMethod("ProcessLogRequest", jm_ps);

    if (jm_outps.GetChildByType("ResultSet") != null && jm_outps.GetChildByType("ResultSet") != "undefined") {
        jm_myOutput = jm_outps.GetChildByType("ResultSet").GetProperty("myOutput");
    }

    trace_raw = jm_myOutput;
    if (localStorage.BCRM_OPT_StartTracing_TraceType != "Allocation") {
        trace_parsed = BCRMParseTrace(jm_myOutput);
    }

    var cm = $("<div id='bcrm_cm'>");
    var dlg = $("<div style='overflow:none;'>");
    dlg.append(cm);

    //ahansal added support for codemirror
    dlg.dialog({
        title: "Trace File Viewer",
        width: 1300,
        height: 600,
        modal: false,
        draggable: true,
        autoOpen: true,
        overflow: scroll,
        resizable: true,
        buttons: {
            ShowChart: {
                text: "Show Chart",
                click: function (e) {
                    var cdata = BCRMShowTraceStats("chart");
                    BCRMChartEngine("Query Stats", "horizontalBar", cdata.labels, cdata.data);
                    $("#bcrm_chart").dialog({
                        width: 800,
                        height: 500,
                        modal: false
                    });
                }
            },
            ShowStats: {
                text: "Show Stats",
                click: function (e) {
                    if (sessionStorage.BCRMShowStats == "true") {
                        BCRMResetTrace();
                        sessionStorage.BCRMShowStats = "false";
                        $(e.currentTarget).text("Show Stats");
                    }
                    else {
                        sessionStorage.BCRMShowStats = "true";
                        $(e.currentTarget).text("Reset");
                        $("#bcrm_cm").find(".CodeMirror")[0].CodeMirror.setValue(BCRMShowTraceStats());
                    }
                }
            },
            ShowWorst: {
                text: "Show Slowest",
                click: function (e) {
                    if (sessionStorage.BCRMShowWorst == "true") {
                        BCRMResetTrace();
                        sessionStorage.BCRMShowWorst = "false";
                        $(e.currentTarget).text("Show Slowest");
                    }
                    else {
                        sessionStorage.BCRMShowWorst = "true";
                        $(e.currentTarget).text("Show All");
                        $("#bcrm_cm").find(".CodeMirror")[0].CodeMirror.setValue(BCRMShowWorstQueries());
                    }
                }
            },
            ToggleRR: {
                text: sessionStorage.BCRMHideRRTrace == "true" ? "Show RR Queries" : "Hide RR Queries",
                click: function (e) {
                    if (sessionStorage.BCRMHideRRTrace == "true") {
                        BCRMResetTrace();
                        sessionStorage.BCRMHideRRTrace = "false";
                        $(e.currentTarget).text("Hide RR Queries");
                    }
                    else {
                        BCRMRemoveRRTrace(trace_parsed);
                        sessionStorage.BCRMHideRRTrace = "true";
                        $(e.currentTarget).text("Show RR Queries");
                    }
                }
            },
            Close: function (e, ui) {
                $(this).dialog("destroy");
                sessionStorage.BCRMShowWorst = "false";
                sessionStorage.BCRMShowStats = "false";
            },
            Copy: function () {
                $(this).focus();
                var tempta = $("<textarea id='bcrm_temp_ta'>");
                tempta.val($("#bcrm_cm").find(".CodeMirror")[0].CodeMirror.getValue());
                tempta.appendTo("body");
                tempta.focus();
                tempta[0].select();
                document.execCommand('copy');
                tempta.remove();
            }
        }
    });
    var cmval = trace_raw;
    if (localStorage.BCRM_OPT_StartTracing_TraceType != "Allocation") {
        if (sessionStorage.BCRMHideRRTrace == "true") {
            cmval = BCRMRemoveRRTrace(trace_parsed, true);
        }
    }
    setTimeout(function () {
        CodeMirror($("#bcrm_cm")[0], {
            value: cmval,
            mode: "text/x-sql",
            lineNumbers: true
        });
        $("#bcrm_cm").children("div").css("height", "500px");
    }, 100);
};

BCRMResetTrace = function () {
    $("#bcrm_cm").find(".CodeMirror")[0].CodeMirror.setValue(trace_raw);
};

BCRMRemoveRRTrace = function (p, textonly) {
    trace_norr = "";
    var tokens = p.tokens;
    for (t in tokens) {
        if (!tokens[t].isrr) {
            if (tokens[t].type != "COMMENT" && t != "0.0") {
                trace_norr += "SQLSTMT" + tokens[t].text;
            }
            else {
                trace_norr += tokens[t].text;
            }
        }
    }
    if (!textonly) {
        $("#bcrm_cm").find(".CodeMirror")[0].CodeMirror.setValue(trace_norr);
    }
    else {
        return trace_norr;
    }
};

//Show stats
BCRMShowTraceStats = function (type) {
    var divisor = 5;
    var top = 10;
    var agg = trace_parsed.agg;
    var tot = trace_parsed.totals;
    var tbl = trace_parsed.tables;
    var chartdata = {
        labels: [],
        data: []
    };
    var out = "SQL TRACE STATS\n";
    var dt;
    var i;
    var ti;
    var ta;
    var bar = "#";
    dt = new Date(tot.starttime);
    out += "Trace started    : " + dt.toLocaleString() + "\n";
    dt = new Date(tot.endtime);
    out += "Trace stopped    : " + dt.toLocaleString() + "\n";
    out += "Total Statements : " + tot.stmt_count + "\n";
    out += "Time Measurements: " + tot.timer_count + "\n";
    out += "Total DB Time(ms): " + tot.total_time + "\n";
    out += "Worst SELECT (ms): " + tot.longest_select + "\n";
    out += "Worst INSERT (ms): " + tot.longest_insert + "\n";
    out += "Worst UPDATE (ms): " + tot.longest_update + "\n";
    out += "Worst DELETE (ms): " + tot.longest_delete + "\n";

    out += "\n\nDETAILED QUERY COUNTS\n";
    //selects, no RR
    ti = agg.select_count - agg.rr_query_count;
    bar = "\t#";
    for (i = 0; i <= ti / divisor; i++) {
        bar += "#";
    }

    out += "SELECT (NO RR):" + ti + bar + "\n";
    chartdata.labels.push("SELECT (NO RR)");
    chartdata.data.push(ti);

    //selects, RR
    ti = agg.rr_query_count;
    bar = "\t#";
    for (i = 0; i <= ti / divisor; i++) {
        bar += "#";
    }
    out += "SELECT (RR)   :" + ti + bar + "\n";
    chartdata.labels.push("SELECT (RR)");
    chartdata.data.push(ti);

    //inserts
    ti = agg.insert_count;
    bar = "\t#";
    for (i = 0; i <= ti / divisor; i++) {
        bar += "#";
    }
    out += "INSERT        :" + ti + bar + "\n";
    chartdata.labels.push("INSERT");
    chartdata.data.push(ti);

    //updates
    ti = agg.update_count;
    bar = "\t#";
    for (i = 0; i <= ti / divisor; i++) {
        bar += "#";
    }
    out += "UPDATE        :" + ti + bar + "\n";
    chartdata.labels.push("UPDATE");
    chartdata.data.push(ti);

    //deletes
    ti = agg.delete_count;
    bar = "\t#";
    for (i = 0; i <= ti / divisor; i++) {
        bar += "#";
    }
    out += "DELETE        :" + ti + bar + "\n";
    chartdata.labels.push("DELETE");
    chartdata.data.push(ti);

    out += "\n\nTOP " + top + " TABLE USAGE: SELECT\n";
    ta = tbl.mostselected;
    var lim = ta.length >= top ? top : ta.length;
    for (t = 0; t < lim; t++) {
        ti = ta[t].count;
        var tn = ta[t].table;
        var fill = 25 - tn.length;
        for (f = 0; f < fill; f++) {
            tn += " ";
        }
        bar = "\t#";
        for (i = 0; i <= ti; i++) {
            bar += "#";
        }
        out += tn + ": " + ti + bar + "\n";
    }

    out += "\n\nTOP " + top + " TABLE USAGE: INSERT\n";
    ta = tbl.mostinserted;
    var lim = ta.length >= top ? top : ta.length;
    for (t = 0; t < lim; t++) {
        ti = ta[t].count;
        var tn = ta[t].table;
        var fill = 25 - tn.length;
        for (f = 0; f < fill; f++) {
            tn += " ";
        }
        bar = "\t#";
        for (i = 0; i <= ti; i++) {
            bar += "#";
        }
        out += tn + ": " + ti + bar + "\n";
    }
    out += "\n\nTOP " + top + " TABLE USAGE: UPDATE\n";
    ta = tbl.mostupdated;
    var lim = ta.length >= top ? top : ta.length;
    for (t = 0; t < lim; t++) {
        ti = ta[t].count;
        var tn = ta[t].table;
        var fill = 25 - tn.length;
        for (f = 0; f < fill; f++) {
            tn += " ";
        }
        bar = "\t#";
        for (i = 0; i <= ti; i++) {
            bar += "#";
        }
        out += tn + ": " + ti + bar + "\n";
    }
    out += "\n\nTOP " + top + " TABLE USAGE: DELETE\n";
    ta = tbl.mostdeleted;
    var lim = ta.length >= top ? top : ta.length;
    for (t = 0; t < lim; t++) {
        ti = ta[t].count;
        var tn = ta[t].table;
        var fill = 25 - tn.length;
        for (f = 0; f < fill; f++) {
            tn += " ";
        }
        bar = "\t#";
        for (i = 0; i <= ti; i++) {
            bar += "#";
        }
        out += tn + ": " + ti + bar + "\n";
    }
    if (typeof (type) === "undefined" || type == "text") {
        return out;
    }
    else if (type == "chart") {
        return chartdata;
    }
}
//show worst queries
BCRMShowWorstQueries = function () {
    var sta = trace_parsed.worst_statements;
    var divisor = 5;
    var tracew = "";
    var max = 0;
    var ma = [];
    var sa;
    var i;
    //sort
    for (i = 0; i < sta.length; i++) {
        ma.push([sta[i].sql, sta[i].time]);
    }
    ma.sort(function (a, b) {
        return b[1] - a[1];
    });
    for (i = 0; i < ma.length; i++) {
        var bar = "MILLISECONDS:" + ma[i][1] + " *";
        for (var b = 0; b < parseInt(ma[i][1]) / divisor; b++) {
            bar += "*";
        }
        bar += "\n";
        tracew += bar + ma[i][0] + "\n\n";
    }
    return tracew;
}

//courtesy of Jason MacZura: start tracing from browser
BCRMStartLogging = function () {
    var jm_service = SiebelApp.S_App.GetService("FWK Runtime");
    var jm_ps = SiebelApp.S_App.NewPropertySet();
    //get saved/defaults
    var fp, tt;
    if (typeof (localStorage.BCRM_OPT_StartTracing_FilePath) !== "undefined") {
        fp = localStorage.BCRM_OPT_StartTracing_FilePath;
    }
    else {
        fp = devpops_config.ses_home + "\\temp\\";
    }
    if (typeof (localStorage.BCRM_OPT_StartTracing_TraceType) !== "undefined") {
        tt = localStorage.BCRM_OPT_StartTracing_TraceType;
    }
    else {
        tt = "SQL";
    }
    jm_ps.SetProperty("FilePath", fp);
    jm_ps.SetProperty("Operation", "StartLogging");
    jm_ps.SetProperty("TraceType", tt);
    var jm_outps = jm_service.InvokeMethod("ProcessLogRequest", jm_ps);
    var jm_myOutput = "";

    if (jm_outps.GetChildByType("ResultSet") != null && jm_outps.GetChildByType("ResultSet") != "undefined") {
        jm_myOutput = jm_outps.GetChildByType("ResultSet").GetProperty("Status");
    }
    $(function () {

        if ($('#developer_log').length > 0) {
            $('#developer_log').remove();
        }
        $("body").append('<div id="developer_log" style="background-color:#BDD3F0";>' + jm_myOutput + '</div>');
    });
};

//simple extension to write messages into trace file
BCRMTrace = function (msg) {
    var jm_service = SiebelApp.S_App.GetService("FWK Runtime");
    var jm_ps = SiebelApp.S_App.NewPropertySet();
    jm_ps.SetProperty("Operation", "Trace");
    jm_ps.SetProperty("TraceMsg", msg);
    var jm_outps = jm_service.InvokeMethod("ProcessLogRequest", jm_ps);
};

//courtesy of Jason MacZura: stop tracing
BCRMStopLogging = function () {

    const jm_service = SiebelApp.S_App.GetService("FWK Runtime");
    var jm_ps = SiebelApp.S_App.NewPropertySet();

    jm_ps.SetProperty("Operation", "StopLogging");
    var jm_outps = jm_service.InvokeMethod("ProcessLogRequest", jm_ps);
    var jm_myOutput = "";

    if (jm_outps.GetChildByType("ResultSet") != null && jm_outps.GetChildByType("ResultSet") != "undefined") {
        jm_myOutput = jm_outps.GetChildByType("ResultSet").GetProperty("Status");
    }

    $(function () {

        if ($('#developer_log').length > 0) {
            $('#developer_log').remove();
        }
        $("body").append('<div id="developer_log" style="background-color:#BDD3F0";>' + jm_myOutput + '</div>');
    });
};

//not so simple SQL Trace parser
BCRMParseTrace = function (s) {
    //presuming the input is valid SQL trace file content

    //tokenize
    var slow = typeof (localStorage.BCRM_OPT_StartTracing_SlowQuery) !== "undefined" ? localStorage.BCRM_OPT_StartTracing_SlowQuery : 100;
    var timers = [];
    var itimers = [];
    var dtimers = [];
    var utimers = [];
    var stables = {};
    var alltables = {};
    var tcounters = [];
    var ticounters = [];
    var tucounters = [];
    var tdcounters = [];
    var mostused = [];
    var mostqueried = [];
    var mostinserted = [];
    var mostupdated = [];
    var mostdeleted = [];
    var worst = [];
    var maxt = 0;
    var maxd = 0;
    var maxu = 0;
    var maxupd = 0;
    var maxi = 0;
    var rrc = 0;
    var tk = {};
    var type = "";
    var ft;
    var lt;
    var pt;
    var tot;
    var com;
    var comt;
    var statement;
    var isrr = false;
    var stmts = s.split("SQLSTMT");
    tk["0.0"] = {};
    tk["0.0"].text = stmts[0];
    for (var j = 1; j < stmts.length; j++) {
        //get timestamp
        var tsa = stmts[j - 1].split("\n")[stmts[j - 1].split("\n").length - 1].split(",");
        var mm = tsa[0].split("/")[0];
        var dd = tsa[0].split("/")[1];
        var yy = tsa[0].split("/")[2];
        var time = tsa[1];
        //stops working on 1/1/2100
        var ts = new Date("20" + yy + "-" + mm + "-" + dd + "T" + time).getTime();
        if (j > 1) {
            var elapsed = ts - pt;
            pt = ts;
        }
        if (j == 1) {
            ft = ts;
        }
        if (j == stmts.length - 1) {
            lt = ts;
            tot = lt - ft;
        }
        //check for comments
        com = [];
        comt = [];
        if (stmts[j].indexOf(",COMMENT,") > -1) {
            var ca = stmts[j].split(",COMMENT,");
            for (var m = 1; m < ca.length; m++) {
                var ctsa = ca[m - 1].split("\n")[ca[m - 1].split("\n").length - 1].split(",");
                var mm = ctsa[0].split("/")[0];
                var dd = ctsa[0].split("/")[1];
                var yy = ctsa[0].split("/")[2];
                var time = ctsa[1];
                //stops working 1/1/2100
                var cts = new Date("20" + yy + "-" + mm + "-" + dd + "T" + time).getTime();
                comt.push(cts);
                com.push(",COMMENT," + ca[m]);
            }
            statement = ca[0];
        }
        else {
            statement = stmts[j];
        }

        //handle INSERTS
        if (statement.indexOf("INSERT INTO") > -1) {
            type = "INSERT";
            var sn = statement.split(",INSERT/UPDATE,")[0].split(",")[1] + ".0";
            var sql = statement.split(",INSERT/UPDATE,")[1];
            tk[sn] = {};
            tk[sn].type = type;
            tk[sn].text = ",INSERT/UPDATE," + sql;
            tk[sn].timestamp = ts;
            tk[sn].elapsed = elapsed;

            //timer
            if (sql.indexOf("SQLTIME") > -1) {
                var tkt = sql.split(",SQLTIME,");
                var tkd = parseInt(tkt[1].split(",")[1].split("\n")[0]);
                tk[sn].timer = tkd;

                if (tkd > 0) {
                    var tw = itimers;
                    tw.sort(function (a, b) {
                        return b - a;
                    });
                    if (tkd >= slow) {
                        worst.push({ sn: sn, time: tkd, type: type, sql: sql });
                        if (tkd >= tw[0]) {
                            maxi = tkd;
                        }
                    }
                }
                itimers.push(tkd);
            }

            //collect tables
            stables = {};
            var tt = sql.split("INSERT INTO SIEBEL.");
            for (var l = 1; l <= 1; l++) {
                var ttn = tt[l].split("(")[0].trim();
                if (typeof (stables[ttn]) === "undefined") {
                    stables[ttn] = {};
                    stables[ttn].count = 1;
                }
                else {
                    stables[ttn].count = stables[ttn].count + 1;
                }

                if (typeof (alltables[ttn]) === "undefined") {
                    alltables[ttn] = {};
                    alltables[ttn].insert_count = 1;
                }
                else {
                    if (typeof (alltables[ttn].insert_count) === "undefined") {
                        alltables[ttn].insert_count = 1;
                    }
                    else {
                        alltables[ttn].insert_count = alltables[ttn].insert_count + 1;
                    }
                }
                if (alltables[ttn].insert_count > 0) {
                    var ttw = ticounters;
                    ttw.sort(function (a, b) {
                        return b - a;
                    });
                    if (alltables[ttn].insert_count >= ttw[0]) {
                        mostused.push({ table: ttn, count: alltables[ttn].insert_count });
                        mostinserted.push({ table: ttn, count: alltables[ttn].insert_count });
                        //maxu = alltables[ttn].insert_count;
                    }
                }
                ticounters.push(alltables[ttn].insert_count);
            }
            tk[sn].tables = stables;
        }

        //HANDLE UPDATES
        if (statement.indexOf("UPDATE SIEBEL") > -1) {
            type = "UPDATE";
            var sn = statement.split(",INSERT/UPDATE,")[0].split(",")[1] + ".0";
            var sql = statement.split(",INSERT/UPDATE,")[1];
            tk[sn] = {};
            tk[sn].type = type;
            tk[sn].text = ",INSERT/UPDATE," + sql;
            tk[sn].timestamp = ts;
            tk[sn].elapsed = elapsed;

            //timer
            if (sql.indexOf("SQLTIME") > -1) {
                var tkt = sql.split(",SQLTIME,");
                var tkd = parseInt(tkt[1].split(",")[1].split("\n")[0]);
                tk[sn].timer = tkd;

                if (tkd > 0) {
                    var tw = utimers;
                    tw.sort(function (a, b) {
                        return b - a;
                    });
                    if (tkd >= slow) {
                        worst.push({ sn: sn, time: tkd, type: type, sql: sql });
                        if (tkd >= tw[0]) {
                            maxupd = tkd;
                        }
                    }
                }
                utimers.push(tkd);
            }

            //collect tables
            stables = {};
            var tt = sql.split("UPDATE SIEBEL.");
            for (var l = 1; l <= 1; l++) {
                var ttn = tt[l].split(" SET")[0].trim();
                if (typeof (stables[ttn]) === "undefined") {
                    stables[ttn] = {};
                    stables[ttn].count = 1;
                }
                else {
                    stables[ttn].count = stables[ttn].count + 1;
                }

                if (typeof (alltables[ttn]) === "undefined") {
                    alltables[ttn] = {};
                    alltables[ttn].update_count = 1;
                }
                else {
                    if (typeof (alltables[ttn].update_count) === "undefined") {
                        alltables[ttn].update_count = 1;
                    }
                    else {
                        alltables[ttn].update_count = alltables[ttn].update_count + 1;
                    }
                }
                if (alltables[ttn].update_count > 0) {
                    var ttw = tucounters;
                    ttw.sort(function (a, b) {
                        return b - a;
                    });
                    if (alltables[ttn].update_count >= ttw[0]) {
                        mostused.push({ table: ttn, count: alltables[ttn].update_count });
                        mostupdated.push({ table: ttn, count: alltables[ttn].update_count });
                        //maxu = alltables[ttn].insert_count;
                    }
                }
                tucounters.push(alltables[ttn].update_count);
            }
            tk[sn].tables = stables;
        }

        //HANDLE DELETES
        if (statement.indexOf("DELETE FROM") > -1) {
            type = "DELETE";
            var sn = statement.split(",INSERT/UPDATE,")[0].split(",")[1] + ".0";
            var sql = statement.split(",INSERT/UPDATE,")[1];
            tk[sn] = {};
            tk[sn].type = type;
            tk[sn].text = ",INSERT/UPDATE," + sql;
            tk[sn].timestamp = ts;
            tk[sn].elapsed = elapsed;

            //timer
            if (sql.indexOf("SQLTIME") > -1) {
                var tkt = sql.split(",SQLTIME,");
                var tkd = parseInt(tkt[1].split(",")[1].split("\n")[0]);
                tk[sn].timer = tkd;

                if (tkd > 0) {
                    var tw = dtimers;
                    tw.sort(function (a, b) {
                        return b - a;
                    });
                    if (tkd >= slow) {
                        worst.push({ sn: sn, time: tkd, type: type, sql: sql });
                        if (tkd >= tw[0]) {
                            maxd = tkd;
                        }
                    }
                }
                dtimers.push(tkd);
            }
            //collect tables
            stables = {};
            var tt = sql.split("DELETE FROM SIEBEL.");
            for (var l = 1; l <= 1; l++) {
                var ttn = tt[l].split("\n")[0].trim();
                if (typeof (stables[ttn]) === "undefined") {
                    stables[ttn] = {};
                    stables[ttn].count = 1;
                }
                else {
                    stables[ttn].count = stables[ttn].count + 1;
                }

                if (typeof (alltables[ttn]) === "undefined") {
                    alltables[ttn] = {};
                    alltables[ttn].delete_count = 1;
                }
                else {
                    if (typeof (alltables[ttn].delete_count) === "undefined") {
                        alltables[ttn].delete_count = 1;
                    }
                    else {
                        alltables[ttn].delete_count = alltables[ttn].delete_count + 1;
                    }
                }
                if (alltables[ttn].delete_count > 0) {
                    var ttw = tdcounters;
                    ttw.sort(function (a, b) {
                        return b - a;
                    });
                    if (alltables[ttn].delete_count >= ttw[0]) {
                        mostused.push({ table: ttn, count: alltables[ttn].delete_count });
                        mostdeleted.push({ table: ttn, count: alltables[ttn].delete_count });
                        //maxu = alltables[ttn].insert_count;
                    }
                }
                tdcounters.push(alltables[ttn].delete_count);
            }
            tk[sn].tables = stables;
        }

        //Handle SELECTS
        if (statement.indexOf(",SELECT,") > -1) {
            type = "SELECT";
            var sn = statement.split(",SELECT,")[0].split(",")[1] + ".0";
            var sql = statement.split(",SELECT,")[1];
            if (sql.indexOf("S_RR") > -1 || sql.indexOf("S_WEB_TMPL") > -1 || sql.indexOf("S_UI_") > -1) {
                isrr = true;
                rrc++;
            }
            else {
                isrr = false;
            }
            tk[sn] = {};
            tk[sn].type = type;
            tk[sn].text = ",SELECT," + sql;
            tk[sn].isrr = isrr;
            tk[sn].timestamp = ts;
            tk[sn].elapsed = elapsed;

            //timer
            if (sql.indexOf("SQLTIME") > -1) {
                var tkt = sql.split(",SQLTIME,");
                var tkd = parseInt(tkt[1].split(",")[1].split("\n")[0]);
                tk[sn].timer = tkd;

                if (tkd > 0) {
                    var tw = timers;
                    tw.sort(function (a, b) {
                        return b - a;
                    });
                    if (tkd >= slow) {
                        worst.push({ sn: sn, time: tkd, type: type, sql: sql });
                        if (tkd >= tw[0]) {
                            maxt = tkd;
                        }
                    }
                }
                timers.push(tkd);
            }
            //collect tables
            stables = {};
            var tt = sql.split("SIEBEL.");
            for (var l = 1; l < tt.length; l++) {
                var ttn = tt[l].split(" ")[0];
                if (typeof (stables[ttn]) === "undefined") {
                    stables[ttn] = {};
                    stables[ttn].count = 1;
                }
                else {
                    stables[ttn].count = stables[ttn].count + 1;
                }

                if (typeof (alltables[ttn]) === "undefined") {
                    alltables[ttn] = {};
                    alltables[ttn].select_count = 1;
                }
                else {
                    if (typeof (alltables[ttn].select_count) === "undefined") {
                        alltables[ttn].select_count = 1;
                    }
                    else {
                        alltables[ttn].select_count = alltables[ttn].select_count + 1;
                    }
                }
                if (alltables[ttn].select_count > 1) {
                    var ttw = tcounters;
                    ttw.sort(function (a, b) {
                        return b - a;
                    });
                    if (alltables[ttn].select_count >= ttw[0]) {
                        mostused.push({ table: ttn, count: alltables[ttn].select_count });
                        mostqueried.push({ table: ttn, count: alltables[ttn].select_count });
                        maxu = alltables[ttn].select_count;
                    }
                }
                tcounters.push(alltables[ttn].select_count);
            }
            tk[sn].tables = stables;
        }
        if (com.length > 0) {
            for (var n = 0; n < com.length; n++) {
                var csn = sn.split(".")[0] + "." + (n + 1).toString();
                tk[csn] = {};
                tk[csn].type = "COMMENT";
                tk[csn].text = com[n];
                tk[csn].timestamp = comt[n];
            }
        }
    }

    //aggregate tables
    var select_ranked = [];
    var insert_ranked = [];
    var update_ranked = [];
    var delete_ranked = [];
    for (tbl in alltables) {
        if (typeof (alltables[tbl].select_count) !== "undefined") {
            //ignore RR tables
            if (!(tbl.indexOf("S_RR") > -1 || tbl.indexOf("S_WEB_TMPL") > -1 || tbl.indexOf("S_UI_") > -1)) {
                select_ranked.push({ table: tbl, count: alltables[tbl].select_count });
            }
        }
        if (typeof (alltables[tbl].insert_count) !== "undefined") {
            insert_ranked.push({ table: tbl, count: alltables[tbl].insert_count });
        }
        if (typeof (alltables[tbl].update_count) !== "undefined") {
            update_ranked.push({ table: tbl, count: alltables[tbl].update_count });
        }
        if (typeof (alltables[tbl].delete_count) !== "undefined") {
            delete_ranked.push({ table: tbl, count: alltables[tbl].delete_count });
        }
    }
    select_ranked.sort(function (a, b) {
        return b.count - a.count;
    });
    insert_ranked.sort(function (a, b) {
        return b.count - a.count;
    });
    update_ranked.sort(function (a, b) {
        return b.count - a.count;
    });
    delete_ranked.sort(function (a, b) {
        return b.count - a.count;
    });

    //collect stats
    var stats = {};
    stats.totals = {};
    stats.agg = {};
    stats.totals.stmt_count = s.split("SQLSTMT").length - 1;
    stats.agg.select_count = s.split(",SELECT,").length - 1;
    stats.agg.insert_count = s.split("INSERT INTO").length - 1;
    stats.agg.update_count = s.split("UPDATE ").length - 1;
    stats.agg.delete_count = s.split("\"DELETE").length - 1;
    stats.totals.timer_count = s.split(",SQLTIME,").length - 1;
    stats.totals.line_count = s.split("\n").length - 1;
    //get timings
    var t = s.split(",SQLTIME,");
    var total_time = 0;
    for (var i = 1; i < t.length; i++) {
        var td = parseInt(t[i].split(",")[1].split("\n")[0]);
        total_time += td;
    }
    stats.totals.total_time = total_time;
    stats.totals.longest_select = maxt;
    stats.totals.longest_delete = maxd;
    stats.totals.longest_insert = maxi;
    stats.totals.longest_update = maxupd;
    stats.worst_statements = worst;
    stats.agg.rr_query_count = rrc;
    stats.tables = {};
    stats.tables.alltables = alltables;
    stats.tables.mostselected = select_ranked;
    stats.tables.mostinserted = insert_ranked;
    stats.tables.mostupdated = update_ranked;
    stats.tables.mostdeleted = delete_ranked;
    //stats.tables.mostused = mostused;
    stats.tokens = tk;
    stats.totals.starttime = ft;
    stats.totals.endtime = lt;
    stats.totals.totaltime = tot;
    return stats;
};

//END TRACE FILE VIEWER by Jason MacZura******************************

//View Tracer (piggybacks on PM until further notice)
BCRMTraceView = function () {
    if (sessionStorage.BCRMTracingCycle == "StartTracing" && localStorage.BCRM_OPT_StartTracing_TraceEvents == "Presentation Model") {
        var vn = SiebelApp.S_App.GetActiveView().GetName();
        BCRMTrace("VIEWTRACE:" + vn + "::postload");
    }
};
//PM Invoke Method handler for enhanced tracing
BCRMTracePMMethod = function (m, i, c, r) {
    if (sessionStorage.BCRMTracingCycle == "StartTracing" && localStorage.BCRM_OPT_StartTracing_TraceEvents == "Presentation Model") {
        var ut = new SiebelAppFacade.BCRMUtils();
        var pm = ut.ValidateContext(this);
        if (pm && typeof (pm.GetObjName) === "function") {
            var on = pm.GetObjName();
            var vn = SiebelApp.S_App.GetActiveView().GetName();
            BCRMTrace("PMTRACE:" + vn + "::" + on + "::" + m);
        }
    }
}
//PM Invoke Method handler for ShowSelection
var bcrm_sc_counter = 0;
BCRMTraceShowSelection = function () {
    //calling trace causes a loop on ShowSelection
    //workaround with counter which is reset after 2 seconds
    bcrm_sc_counter++;
    if (bcrm_sc_counter == 1) {
        if (sessionStorage.BCRMTracingCycle == "StartTracing" && localStorage.BCRM_OPT_StartTracing_TraceEvents == "Presentation Model") {
            var ut = new SiebelAppFacade.BCRMUtils();
            var pm = ut.ValidateContext(this);
            if (pm && typeof (pm.GetObjName) === "function") {
                var on = pm.GetObjName();
                var vn = SiebelApp.S_App.GetActiveView().GetName();
                BCRMTrace("PMTRACE:" + vn + "::" + on + "::" + "ShowSelection");
            }
        }
        setTimeout(function () {
            bcrm_sc_counter = 0;
        }, 2000);
    }
}
//PM Invoke Method handler for FieldChange
BCRMTraceFieldChange = function (f, v) {
    if (sessionStorage.BCRMTracingCycle == "StartTracing" && localStorage.BCRM_OPT_StartTracing_TraceEvents == "Presentation Model") {
        var ut = new SiebelAppFacade.BCRMUtils();
        var pm = ut.ValidateContext(this);
        if (pm && typeof (pm.GetObjName) === "function") {
            var on = pm.GetObjName();
            var vn = SiebelApp.S_App.GetActiveView().GetName();
            BCRMTrace("PMTRACE:" + vn + "::" + on + "::" + "FieldChange::" + f.GetDisplayName() + " (" + f.GetFieldName() + ")::" + v);
        }
    }
}

//PM Tracing registration
BCRMRegisterPMTracing = function () {
    var am = SiebelApp.S_App.GetActiveView().GetAppletMap();
    for (a in am) {
        pm = am[a].GetPModel();
        if (pm.Get("BCRMInvokeMethodTracing") != "enabled") {
            //attach invoke method handler
            pm.AddMethod("InvokeMethod", BCRMTracePMMethod, { sequence: true, scope: pm });
            pm.AddMethod("ShowSelection", BCRMTraceShowSelection, { scope: pm, sequence: true });
            //FieldChange tracing kills popups, let's not do this
            //pm.AttachPMBinding("FieldChange", BCRMTraceFieldChange, { scope: pm, sequence: true });
            pm.SetProperty("BCRMInvokeMethodTracing", "enabled");
        }
    }
}

//xray postload helper to apply default settings
BCRMApplyDefaultXray = function () {
    var ut = new SiebelAppFacade.BCRMUtils();
    var t = sessionStorage.BCRM_TOGGLE_DEFAULT;
    var am = SiebelApp.S_App.GetActiveView().GetAppletMap();
    if (typeof (t) !== "undefined") {
        if (t != "") {
            for (a in am) {
                var pm = ut.ValidateContext(a);
                if (pm && pm.Get("BCRM_DEFAULT_XRAY") != "true") {
                    pm.SetProperty("BCRM_DEFAULT_XRAY", "true");
                    ut.ToggleLabels(t, a);
                }
            }
            $("#bcrm_debug_msg").text("X-Ray default set to: " + t);
        }
    }
};

BCRMCheckVersion = function () {
    if (!devpops_vcheck) {
        var vd = $.ajax({
            dataType: "json",
            url: "https://raw.githubusercontent.com/blacksheep-crm/devpops/main/v",
            async: false
        });
        devpops_vcheck = true;
        devpops_uv = vd.responseJSON;
    }
    //check FWK version
    if (FWK_VERSION == 0) {
        FWK_VERSION = BCRMGetFWKVersion();
        if (FWK_VERSION < devpops_version) {
            SiebelApp.Utils.Alert("FWK Runtime business service is out of date.\nInstall latest FWK Runtime version to avoid devpops malfunction.");
        }
    }
}

//open popup
BCRMOpenPopup = function (applet, mode) {
    //mode: 1=list, 2=form
    var sv = SiebelApp.S_App.GetService("FWK Runtime");
    var ip = SiebelApp.S_App.NewPropertySet();
    ip.SetProperty("Applet Name", applet);
    ip.SetProperty("Applet Mode", mode);
    var op = sv.InvokeMethod("openPopup", ip);
};

//Read Tech Support Info
BCRMGetTechSupportInfo = function () {
    var tempcss = ".ui-widget-overlay,.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.ui-draggable.ui-resizable {display: none!important;}";
    var st = $("<style bcrm-temp-style='yes'>" + tempcss + "</style>");
    if ($("style[bcrm-temp-style]").length == 0) {
        $("head").append(st);
    }
    BCRMOpenPopup("Technical Support Applet", "2");
    setTimeout(function () {
        try {
            var pm = SiebelApp.S_App.GetActiveView().GetAppletMap()["Technical Support Applet"].GetPModel();
            var cs = pm.Get("GetControls");
            var cver = cs["ApplicationVersion"];
            var crep = cs["RepositoryFile"];
            var ws = "";
            BCRM_SIEBEL_VERSION = pm.ExecuteMethod("GetFieldValue", cver);
            var vt = BCRM_SIEBEL_VERSION;
            BCRM_SIEBEL_V.y = parseInt(vt.split(".")[0]);
            BCRM_SIEBEL_V.m = parseInt(vt.split(".")[1]);
            ws = pm.ExecuteMethod("GetFieldValue", crep);
            BCRM_WORKSPACE.WS = ws.split("[")[1].split("/")[0];
            BCRM_WORKSPACE.VER = ws.split("[")[1].split("/")[1].split("]")[0];
            BCRM_WORKSPACE.STATUS = ws.split("[")[1].split("/")[1].split("]")[1].split(" - ")[1];
            /*
            sessionStorage.BCRMCurrentWorkspace = BCRM_WORKSPACE.WS;
            if (BCRM_WORKSPACE.VER == "Latest"){
                if (isNaN(sessionStorage.BCRMCurrentWorkspaceVersion)){
                    sessionStorage.BCRMCurrentWorkspaceVersion = BCRM_WORKSPACE.VER;
                }
            }
            //sessionStorage.BCRMCurrentWorkspaceVersion = BCRM_WORKSPACE.VER;
            sessionStorage.BCRMCurrentWorkspaceStatus = BCRM_WORKSPACE.STATUS;
            BCRMWSUpdateWSBanner(sessionStorage.BCRMCurrentWorkspace, sessionStorage.BCRMCurrentWorkspaceVersion, sessionStorage.BCRMCurrentWorkspaceStatus);
            */
            pm.ExecuteMethod("InvokeMethod", "CloseApplet");
        }
        catch (e) {
            console.log("devpops error while secretely opening the Tech Support Applet: " + e.toString());
            $(".ui-widget-overlay").remove();
        }
        $("head").find("style[bcrm-temp-style]").remove();
    }, 1000);
};

//version check
//example input (20,7,"ge"): true if current version is greater than or equal to 20.7; false if current version is 20.6 or earlier
BCRMSiebelVersionCheck = function (y, m, mode) {
    //mode: lt=less than, le=less than or equal, gt=greater than, ge=greater than or equal, eq=equal
    var curv_y = BCRM_SIEBEL_V.y;
    var curv_m = BCRM_SIEBEL_V.m;
    var retval = false;
    if (mode == "ge") {
        if (curv_y == y && curv_m >= m) {
            retval = true;
        }
        if (curv_y > y) {
            retval = true;
        }
    }
    if (mode == "gt") {
        if (curv_y == y && curv_m > m) {
            retval = true;
        }
        if (curv_y > y) {
            retval = true;
        }
    }
    if (mode == "le") {
        if (curv_y == y && curv_m <= m) {
            retval = true;
        }
        if (curv_y < y) {
            retval = true;
        }
    }
    if (mode == "lt") {
        if (curv_y == y && curv_m < m) {
            retval = true;
        }
        if (curv_y < y) {
            retval = true;
        }
    }
    if (mode == "eq") {
        if (curv_y == y && curv_m == m) {
            retval = true;
        }
    }
    return retval;
};

//FWK Runtime service version check
BCRMGetFWKVersion = function () {
    var retval = null;
    var v = 0;
    var sv = SiebelApp.S_App.GetService("FWK Runtime");
    var ip = SiebelApp.S_App.NewPropertySet();
    var op = sv.InvokeMethod("getFWKVersion", ip);
    v = op.GetChildByType("ResultSet").GetProperty("FWK Version");
    if (typeof (v) !== "undefined") {
        retval = parseInt(v);
    }
    else {
        retval = -1;
    }
    return retval;
};

//main postload function
BCRMWSHelper = function () {
    try {
        var vn = SiebelApp.S_App.GetActiveView().GetName();
        var an = "BCRM Modified Objects List Applet";
        var am = SiebelApp.S_App.GetActiveView().GetAppletMap();
        var ut = new SiebelAppFacade.BCRMUtils();
        var pm;
        //enhance view
        if (vn == "BCRM Modified Objects List View") {
            //import mergely
            var css = $("<link type='text/css' href='https://cdn.rawgit.com/wickedest/Mergely/3.4.0/lib/mergely.css' rel='stylesheet'>");
            var jdp = $("<script type='text/javascript' src='https://cdn.rawgit.com/wickedest/Mergely/3.4.1/lib/mergely.js'></script>");

            if ($("script[src*='mergely']").length == 0) {
                $("head").append(jdp);
                $("head").append(css);
            }

            pm = SiebelApp.S_App.GetActiveView().GetApplet(an).GetPModel();
            pm.AttachPMBinding("ShowSelection", BCRMWSEnhancer, { scope: pm, sequence: true });
            BCRMWSEnhancer(pm);
        }

        //enhance Web Tools
        /*
        if (SiebelApp.S_App.GetAppName() == "Siebel Web Tools") {
            BCRMWebToolsEnhancer();
        }
        */
        //enhance application
        if (SiebelApp.S_App.GetAppName() != "Siebel Web Tools") {
            //add right click handler to Dashboard icon
            BCRMWSIconEnhancer();

            //add debug button
            BCRMAddDebugButton();

            //xray handler
            for (a in am) {
                ut.AddXrayHandler(a);
            }

            //default xray toggle
            BCRMApplyDefaultXray();

            //PM tracing
            BCRMRegisterPMTracing();

            //View tracing
            BCRMTraceView();

            //Version chack
            BCRMCheckVersion();

            //experimental: include chart.js
            var cjs = $('<script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>');
            if ($("script[src*='chart.js']").length == 0) {
                $("head").append(cjs);
            }

            //show current workspace
            //if (typeof (sessionStorage.BCRMCurrentWorkspace) !== "undefined") {
            if (BCRM_SIEBEL_VERSION != "") {
                BCRMWSUpdateWSBanner(sessionStorage.BCRMCurrentWorkspace, sessionStorage.BCRMCurrentWorkspaceVersion, sessionStorage.BCRMCurrentWorkspaceStatus);
            }

            //get version and workspace
            if (BCRM_SIEBEL_VERSION == "") {
                BCRMGetTechSupportInfo();
            }

            BCRMReloadCache();

            //multiselect
            /*
            var mjs = $('<script src="scripts/siebel/custom/ui.multiselect.js"></script>');
            if ($("script[src*='ui.multiselect.js']").length == 0) {
                $("head").append(mjs);
            }
            */
        }

    }
    catch (e) {
        console.log("Error in BCRMWSHelper: " + e.toString());
    }
};

SiebelApp.EventManager.addListner("postload", BCRMWSHelper, this);

//START XRAY21*******************************************************
//everything below this line should go into a separate utility file
//Util collection for XRAY 21
if (typeof (SiebelAppFacade.BCRMUtils) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.BCRMUtils");

    SiebelAppFacade.BCRMUtils = (function () {
        function BCRMUtils(options) { }

        //xray handler: defines trigger event
        BCRMUtils.prototype.AddXrayHandler = function (context) {
            var ut = new SiebelAppFacade.BCRMUtils();
            var pm = ut.ValidateContext(context);
            var tp = "";
            var ae;
            if (pm) {
                tp = ut.GetAppletType(pm);
                if (tp == "form" || tp == "list") {
                    if (pm.Get("BCRM_XRAY_HANDLER_ENABLED") != "true") {
                        ae = ut.GetAppletElem(pm);
                        ae.dblclick(function () //jQuery double-click event handler
                        {
                            var cycle; //the toggle cycle
                            switch (pm.Get("C_ToggleCycle")) {
                                case "ShowControls": cycle = "ShowBCFields";
                                    break;
                                case "ShowBCFields": cycle = "ShowTableColumns";
                                    break;
                                case "ShowTableColumns": cycle = "Reset";
                                    break;
                                case "Reset": cycle = "ShowControls";
                                    break;
                                default: cycle = "ShowControls";
                                    break;
                            }
                            pm.SetProperty("C_ToggleCycle", cycle); //set property to current cycle
                            ut.ToggleLabels(cycle, pm); //call utility method
                            //console.log(cycle);
                        });
                        //console.log("BCRM XRay double-click handler enabled on: " + pm.GetObjName());
                        pm.SetProperty("BCRM_XRAY_HANDLER_ENABLED", "true");
                    }
                }

            }
        };

        //toggle labels main function
        BCRMUtils.prototype.ToggleLabels = function (cycle, context) {
            var ut = new SiebelAppFacade.BCRMUtils();
            var pm = ut.ValidateContext(context);
            if (pm) {
                switch (cycle) //determine current toggle cycle and spawn functions
                {
                    case "ShowControls": ut.ShowControls(pm);
                        break;
                    case "ShowBCFields": ut.ShowBCFields(pm);
                        break;
                    //only simple physical metatdata as of yet,
                    case "ShowTableColumns": ut.ShowTableColumns(pm);
                        break;
                    case "Reset": ut.LabelReset(pm);
                        break;
                    default: ut.ShowBCFields(pm);
                        break;
                }
            }
        };

        //reset to original labels
        BCRMUtils.prototype.LabelReset = function (context) {
            var ut = new SiebelAppFacade.BCRMUtils();
            var pm = ut.ValidateContext(context);
            var tp, cs, le, uit;
            if (pm) {
                pm.SetProperty("C_ToggleCycle", "Reset");
                tp = ut.GetAppletType(pm);
                if (tp == "form" || tp == "list") {
                    cs = pm.Get("GetControls");
                    for (c in cs) {
                        if (cs.hasOwnProperty(c)) {
                            le = ut.GetLabelElem(cs[c], pm);
                            //look for "custom" labels
                            if (le && le.attr("bcrm-custom-label") != "") {
                                if (le.parent().hasClass("siebui-btn-grp-applet")) {
                                    ut.SetLabel(cs[c], "", pm);
                                }
                                else {
                                    ut.SetLabel(cs[c], cs[c].GetDisplayName(), pm);
                                }
                            }

                        }
                    }
                }
            }
        };

        //set label for a control
        BCRMUtils.prototype.SetLabel = function (c, nl, context) {
            var ut = new SiebelAppFacade.BCRMUtils();
            var pm = ut.ValidateContext(context);
            var le;
            var tc, otitle;
            if (pm) {
                le = ut.GetLabelElem(c, pm);
                if (le) {
                    tc = pm.Get("C_ToggleCycle");
                    otitle = le.attr("title");
                    if (otitle == "" || typeof (otitle) === "undefined") {
                        otitle = "DisplayName" + ": " + le.text();
                    }
                    if (otitle.indexOf(nl) == -1) {
                        otitle += "\n|_" + tc + ": " + nl;
                    }
                    le.html(nl);
                    le.attr("title", otitle);
                    //mark label as changed

                    switch (tc) {
                        case "ShowControls": le.attr("style", "color:blue!important;");
                            break;
                        case "ShowBCFields": le.attr("style", "color:red!important;");
                            break;
                        case "ShowTableColumns": le.attr("style", "color:green!important;");
                            break;
                        default: le.attr("style", "");
                    }
                    if (tc != "Reset") {
                        le.attr("bcrm-custom-label", tc);
                        le.css("padding", "2px");
                        le.css("border", "1px solid lightgrey");
                        le.css("font-weight", "600");
                        le.css("font-family", "monospace");
                        le.css("margin", "2px");
                    }
                    else {
                        le.attr("style", "");
                    }

                }
                //no label, but let's just add a tooltip
                else {
                    otitle = "";
                    var pr = pm.GetRenderer();
                    var cel = pr.GetUIWrapper(c).GetEl();
                    if (cel != null && typeof (cel) !== "undefined") {
                        tc = pm.Get("C_ToggleCycle");
                        if (typeof (cel.attr("title")) !== "undefined") {
                            if (cel.attr("title").indexOf("DisplayName") == -1) {
                                otitle = "DisplayName" + ": " + c.GetDisplayName();
                            }
                            else {
                                otitle = cel.attr("title");
                            }
                        }
                        else {
                            otitle = "DisplayName" + ": " + c.GetDisplayName();
                        }
                        if (otitle.indexOf(nl) == -1) {
                            otitle += "\n|_" + tc + ": " + nl;
                        }
                        cel.attr("title", otitle);
                    }
                }
            }
        };

        //get label element for a control
        BCRMUtils.prototype.GetLabelElem = function (c, context) {
            var ut = new SiebelAppFacade.BCRMUtils();
            var pm = ut.ValidateContext(context);
            var tp;
            var pr, ce, li, ae, inpname, gh, ph, ch, cm, fn, cn, uit;
            var thelabel;
            var retval = null;
            if (pm) {
                tp = ut.GetAppletType(pm);
                pr = pm.GetRenderer();
                ae = ut.GetAppletElem(pm);
                uit = c.GetUIType();
                inpname = c.GetInputName();
                if (tp == "form" && pr.GetUIWrapper(c)) {
                    //get control element
                    ce = pr.GetUIWrapper(c).GetEl();
                    //first attempt: get by label id
                    li = $(ce).attr("aria-labelledby");

                    //first attempt
                    //20.10 or higher have applet id appended to label
                    //use "begins with" logic seems to do the trick
                    //needs more testing
                    thelabel = ae.find("span[id^='" + li + "']");

                    //alternative:re-create label id using applet id

                    //second attempt: try with text
                    if (thelabel.length == 0) {
                        li = $(ce).attr("aria-label");
                        ae.find("span:contains('" + li + "')").each(function (x) {
                            if ($(this).text() == li) {
                                thelabel = $(this);
                            }
                        })
                    }

                    //third attempt: use tag from previous runs
                    if (thelabel.length == 0) {
                        li = inpname;
                        thelabel = ae.find("[bcrm-label-for='" + li + "']");
                    }

                    if (uit == "Button") {
                        thelabel = ae.find("[name='" + inpname + "']");
                    }

                    //check if label has been found
                    if (thelabel.length == 1) {
                        //tag the label
                        thelabel.attr("bcrm-label-for", inpname);
                        retval = thelabel;
                    }
                }
                if (tp == "list" && typeof (c) !== "undefined") {
                    try {
                        gh = ae.find("table.ui-jqgrid-htable");
                        ph = pm.Get("GetPlaceholder");
                        ch = pr.GetColumnHelper();
                        cm = ch.GetColMap();
                        fn = c.GetName();
                        for (col in cm) {
                            if (cm[col] == fn) {
                                cn = col;
                            }
                        }
                        li = "div#jqgh_" + ph + "_" + cn;
                        thelabel = gh.find(li);

                        if (uit == "Button") {
                            thelabel = ae.find("[name='" + inpname + "']");
                        }

                        if (thelabel.length == 1) {
                            retval = thelabel;
                        }
                    }
                    catch (e) {
                        console.log("Error in GetLabelElem for applet: " + pm.GetObjName() + " : " + e.toString());
                    }
                }
                return retval;
            }
        }
        //show BC Field information on labels
        BCRMUtils.prototype.ShowBCFields = function (context) {
            var ut = new SiebelAppFacade.BCRMUtils();
            var pm = ut.ValidateContext(context);
            var bc, fm, cs, tp, fn, fd;
            var fdt, fln, fcl, frq;
            var nl;
            if (pm) {
                pm.SetProperty("C_ToggleCycle", "ShowBCFields");
                bc = pm.Get("GetBusComp");
                fm = bc.GetFieldMap();
                tp = ut.GetAppletType(pm);
                //Form Applet treatment
                if (tp == "form" || tp == "list") {
                    cs = pm.Get("GetControls");
                    for (c in cs) {
                        if (cs.hasOwnProperty(c)) {
                            fn = cs[c].GetFieldName();
                            if (fn != "") {
                                fd = fm[fn];
                                if (typeof (fd) !== "undefined") {
                                    fdt = fd.GetDataType(); //get the data type (text, bool, etc)
                                    fln = fd.GetLength(); //get the field length (30, 100, etc)
                                    frq = fd.IsRequired() ? "*" : ""; //get an asterisk when field is required, otherwise nothing
                                    fcl = fd.IsCalc() ? "C" : ""; //get a "C" when field is calculated, otherwise nothing
                                    nl = fn + " (" + fdt + "/" + fln + ")" + frq + fcl;
                                    ut.SetLabel(cs[c], nl, pm);
                                }
                                else {
                                    ut.SetLabel(cs[c], fn, pm);
                                }
                            }
                        }
                    }
                }
            }
        }

        //Wrapper for BCRM RR Reader service
        BCRMUtils.prototype.GetRRData = function (ot, on) {
            var svc = SiebelApp.S_App.GetService("FWK Runtime");
            var ips = SiebelApp.S_App.NewPropertySet();
            var ops;
            var data;
            ips.SetProperty("Object Type", ot);
            ips.SetProperty("Object Name", on);
            ops = svc.InvokeMethod("GetRRData", ips);
            if (ops.GetProperty("Status") == "OK") {
                data = ops.GetChildByType("ResultSet");
            }
            return data;
        };

        //extract specified data (BC only as of now, but could expand)
        BCRMUtils.prototype.ExtractBCData = function (rrdata) {
            var retval = {};
            var bc;
            var props;
            var pc;
            var cc;
            var fn;
            retval["Business Component"] = {};
            bc = retval["Business Component"];
            props = rrdata.GetChild(0).GetChildByType("Properties").propArray;
            pc = props.length;
            for (p in props) {
                bc[p] = props[p];
            }
            bc["Fields"] = {};
            bc["Joins"] = {};
            bc["Multi Value Links"] = {};
            cc = rrdata.GetChild(0).childArray;
            for (c in cc) {
                if (cc[c].type == "Field") {
                    props = cc[c].GetChildByType("Properties").propArray;
                    fn = cc[c].GetChildByType("Properties").propArray["Name"];
                    bc["Fields"][fn] = {};
                    for (p in props) {
                        bc["Fields"][fn][p] = props[p];
                    }
                }
                if (cc[c].type == "Join") {
                    props = cc[c].GetChildByType("Properties").propArray;
                    fn = cc[c].GetChildByType("Properties").propArray["Name"];
                    bc["Joins"][fn] = {};
                    for (p in props) {
                        bc["Joins"][fn][p] = props[p];
                    }
                }
                if (cc[c].type == "Multi Value Link") {
                    props = cc[c].GetChildByType("Properties").propArray;
                    fn = cc[c].GetChildByType("Properties").propArray["Name"];
                    bc["Multi Value Links"][fn] = {};
                    for (p in props) {
                        bc["Multi Value Links"][fn][p] = props[p];
                    }
                }
            }
            return retval;
        };

        //experimental extraction of "SRF" metadata cache, including NEOs
        //currently limited to BC and Field data
        //requires Base BCRM RR Integration Object and underlying BO/BCs (see sif files on github)
        BCRMUtils.prototype.GetNEOData = function (bc, field) {
            var sv = SiebelApp.S_App.GetService("FWK Runtime");
            var ips = SiebelApp.S_App.NewPropertySet();
            var ops = SiebelApp.S_App.NewPropertySet();
            var retval = {};
            ips.SetProperty("Business Component", bc);
            if (typeof (field) !== "undefined") {
                ips.SetProperty("Field", field);
            }
            ops = sv.InvokeMethod("GetRRBC", ips);
            var listofBC = ops.GetChildByType("ResultSet").GetChildByType("SiebelMessage").GetChild(0);

            //only first BC
            var thebc = listofBC.GetChild(0);
            for (prop in thebc.propArray) {
                retval[prop] = thebc.propArray[prop];
            }
            retval["Fields"] = {};
            var fields = thebc.GetChild(0);
            for (var i = 0; i < fields.GetChildCount(); i++) {
                var field = fields.GetChild(i);
                retval["Fields"][field.GetProperty("Name")] = {};
                for (fprop in field.propArray) {
                    retval["Fields"][field.GetProperty("Name")][fprop] = field.propArray[fprop];
                }
            }
            return retval;
        };

        //wrapper to get "formatted" BC data
        BCRMUtils.prototype.GetBCData = function (bcn) {
            var ut = new SiebelAppFacade.BCRMUtils();
            var rrdata, bcdata, bcd;
            //use variable as client-side cache to avoid multiple queries for the same object
            //tried sesssionstorage but reaches quota
            var cache = "BCRM_RR_CACHE_BC_" + bcn;
            if (typeof (BCRCMETACACHE[cache]) === "undefined") {
                rrdata = ut.GetRRData("Buscomp", bcn);
                bcdata = ut.ExtractBCData(rrdata);
                bcd = bcdata["Business Component"];
                BCRCMETACACHE[cache] = JSON.stringify(bcd);
            }
            else {
                bcd = JSON.parse(BCRCMETACACHE[cache]);
            }
            return bcd;
        };

        //wrapper to get "formatted" BS data
        BCRMUtils.prototype.GetBSData = function (bsn) {
            var ut = new SiebelAppFacade.BCRMUtils();
            var rrdata, bsdata, bsd;
            //use variable as client-side cache to avoid multiple queries for the same object
            //tried sesssionstorage but reaches quota
            var cache = "BCRM_RR_CACHE_BC_" + bsn;
            if (typeof (BCRCMETACACHE[cache]) === "undefined") {
                rrdata = ut.GetRRData("Business Service", bsn);
                bsdata = ut.ExtractBSData(rrdata);
                bsd = bsdata["Business Service"];
                BCRCMETACACHE[cache] = JSON.stringify(bsd);
            }
            else {
                bsd = JSON.parse(BCRCMETACACHE[cache]);
            }
            return bsd;
        };

        BCRMUtils.prototype.ExtractBSData = function (rrdata) {
            var retval = {};
            var bs;
            var props, gprops;
            var cc;
            var gc;
            var ffn;
            var fn;
            retval["Business Service"] = {};
            bs = retval["Business Service"];
            props = rrdata.GetChild(0).GetChildByType("Properties").propArray;
            for (p in props) {
                bs[p] = props[p];
            }
            bs["Business Service Method"] = {};
            cc = rrdata.GetChild(0).childArray;
            for (c in cc) {
                if (cc[c].type == "Business Service Method") {
                    props = cc[c].GetChildByType("Properties").propArray;
                    fn = props["Name"];
                    bs["Business Service Method"][fn] = {};
                    for (p in props) {
                        bs["Business Service Method"][fn][p] = props[p];
                    }

                    bs["Business Service Method"][fn]["Business Service Method Arg"] = {};
                    gc = cc[c].childArray;
                    for (g in gc) {
                        if (gc[g].type == "Business Service Method Arg") {
                            gprops = gc[g].GetChildByType("Properties").propArray;
                            ffn = gprops["Name"];
                            bs["Business Service Method"][fn]["Business Service Method Arg"][ffn] = {};
                            for (gp in gprops) {
                                bs["Business Service Method"][fn]["Business Service Method Arg"][ffn][gp] = gprops[gp];
                            }
                        }
                    }
                }
            }
            return retval;
        };

        BCRMUtils.prototype.GetBusinessServiceList = function () {
            var sv = SiebelApp.S_App.GetService("FWK Runtime");
            var ips = SiebelApp.S_App.NewPropertySet();
            var ops = sv.InvokeMethod("GetBusinessServiceList", ips);
            var props = ops.GetChildByType("ResultSet").propArray;
            var t = [];
            var retval = [];
            for (p in props) {
                t.push([p, props[p]]);
            }
            t.sort(function (a, b) {
                if (a[0] < b[0]) { return -1; }
                if (a[0] > b[0]) { return 1; }
                return 0;
            });
            for (var i = 0; i < t.length; i++) {
                if (t[i][1] == t[i][0]) {
                    retval.push(t[i][1]);
                }
                else {
                    retval.push(t[i][1] + "-[" + t[i][0] + "]");
                }
            }
            return retval;
        };

        //wrapper to get "formatted" BO data
        BCRMUtils.prototype.GetBOData = function (bon, bclist) {
            var ut = new SiebelAppFacade.BCRMUtils();
            var rrdata, bodata, bod;
            rrdata = ut.GetRRData("Business Object", bon);
            bodata = ut.ExtractBOData(rrdata, bclist);
            bod = bodata["Business Object"];
            return bod;
        };

        BCRMUtils.prototype.ExtractBOData = function (rrdata, bclist) {
            var retval = {};
            var bo;
            var props;
            var pc;
            var cc;
            var fn;
            var prim;
            var ut = new SiebelAppFacade.BCRMUtils();
            retval["Business Object"] = {};
            bo = retval["Business Object"];
            props = rrdata.GetChild(0).GetChildByType("Properties").propArray;
            pc = props.length;
            for (p in props) {
                bo[p] = props[p];
                if (p == "Primary Business Component") {
                    prim = props[p];
                    if (typeof (bclist) !== "undefined") {
                        if (bclist.indexOf(prim) == -1) {
                            bclist.push(prim);
                        }
                    }
                }
            }
            bo["Business Object Components"] = {};
            cc = rrdata.GetChild(0).childArray;
            for (c in cc) {
                if (cc[c].type == "Business Object Component") {
                    props = cc[c].GetChildByType("Properties").propArray;
                    fn = props["BusComp"];
                    if (typeof (bclist) === "undefined") {
                        bo["Business Object Components"][fn] = {};
                        for (p in props) {
                            bo["Business Object Components"][fn][p] = props[p];
                            if (p == "Link" && props[p] != "") {
                                bo["Business Object Components"][fn]["LinkProperties"] = ut.GetLinkData(props[p]);
                            }
                        }
                    }
                    else {
                        if (bclist.indexOf(fn) > -1) {
                            bo["Business Object Components"][fn] = {};
                            for (p in props) {
                                bo["Business Object Components"][fn][p] = props[p];
                                if (p == "Link" && props[p] != "") {
                                    bo["Business Object Components"][fn]["LinkProperties"] = ut.GetLinkData(props[p]);
                                }
                            }
                        }
                    }
                }
            }
            return retval;
        };

        //wrapper to get "formatted" Link data
        BCRMUtils.prototype.GetLinkData = function (ln) {
            var ut = new SiebelAppFacade.BCRMUtils();
            var rrdata, lndata, lnd;
            //use variable as client-side cache to avoid multiple queries for the same object
            //tried sesssionstorage but reaches quota
            var cache = "BCRM_RR_CACHE_LINK_" + ln;
            if (typeof (BCRCMETACACHE[cache]) === "undefined") {
                rrdata = ut.GetRRData("Link", ln);
                lndata = ut.ExtractLinkData(rrdata);
                lnd = lndata["Link"];
                BCRCMETACACHE[cache] = JSON.stringify(lnd);
            }
            else {
                lnd = JSON.parse(BCRCMETACACHE[cache]);
            }
            return lnd;
        };
        BCRMUtils.prototype.ExtractLinkData = function (rrdata) {
            var retval = {};
            var ln;
            var props;
            retval["Link"] = {};
            ln = retval["Link"];
            props = rrdata.GetChild(0).GetChildByType("Properties").propArray;
            pc = props.length;
            for (p in props) {
                ln[p] = props[p];
            }
            return retval;
        };

        BCRMUtils.prototype.RemoveLinkOverlay = function () {
            $("[bcrm-bc]").css("border", "inherit");
            $("[id^='bcrm_bc_info']").remove();
        };

        BCRMUtils.prototype.LinkOverlay = function () {
            var ut = new SiebelAppFacade.BCRMUtils();
            var am, bo, bod, ae, bc, link, lt, pnt, it, ln;
            var bclist = [];

            am = SiebelApp.S_App.GetActiveView().GetAppletMap();
            bo = SiebelApp.S_App.GetActiveBusObj().GetName();
            for (a in am) {
                bclist.push(am[a].GetBusComp().GetName());
            }
            //get BO Data
            bod = ut.GetBOData(bo, bclist);

            //2nd pass: read BO data and apply to applets
            for (a2 in am) {
                var isprimary = false;
                var bcn = am[a2].GetBusComp().GetName();
                var id = am[a2].GetId();
                ae = ut.GetAppletElem(am[a2]);
                ae.attr("bcrm-bc", bcn);
                if (bod["Primary Business Component"] == bcn) {
                    isprimary = true;
                    ae.attr("bcrm-is-primary", "true");
                    ae.css("border", "6px solid red");
                }
                else {
                    ae.css("border", "3px solid red");
                }
                var box = $("<div id='bcrm_bc_info_" + id + "' style='border: 2px solid red; background:#eee; font-size:1.2em; width:fit-content; padding: 2px; margin:auto; border-radius:8px'>");
                box.text((isprimary ? "Primary " : "") + "Business Component: " + bcn);
                //Links
                if (!isprimary) {
                    for (b in bod["Business Object Components"]) {
                        if (b == bcn) {
                            bc = bod["Business Object Components"][b];
                            if (typeof (bc["LinkProperties"]) !== "undefined") {
                                link = bc["LinkProperties"];
                                it = link["Inter Table"];
                                lt = it == "" ? "1:M" : "M:M";
                                pnt = link["Parent Business Component"];
                                ln = link["Name"];
                                box.html(box.text() + "<br>Link: " + ln + "<br>Type: " + lt + (it == "" ? "" : "(" + it + ")") + "<br>Parent BC: " + pnt);
                            }
                        }
                    }
                    ae.prepend(box);
                }
                else {
                    ae.append(box);
                }
            }
        };
        BCRMUtils.prototype.ExtractAppletData = function (rrdata) {
            var retval = {};
            var ap;
            var props;
            var pc;
            var cc;
            var fn;
            retval["Applet"] = {};
            ap = retval["Applet"];
            props = rrdata.GetChild(0).GetChildByType("Properties").propArray;
            pc = props.length;
            for (p in props) {
                ap[p] = props[p];
            }
            ap["Controls"] = {};
            cc = rrdata.GetChild(0).childArray;
            for (c in cc) {
                if (cc[c].type == "Control") {
                    props = cc[c].GetChildByType("Properties").propArray;
                    fn = cc[c].GetChildByType("Properties").propArray["Name"];
                    ap["Controls"][fn] = {};
                    for (p in props) {
                        ap["Controls"][fn][p] = props[p];
                    }
                }
            }
            return retval;
        };

        BCRMUtils.prototype.GetAppletData = function (an) {
            var ut = new SiebelAppFacade.BCRMUtils();
            var rrdata, appletdata, ad;
            //use variable as client-side cache to avoid multiple queries for the same object
            //tried sesssionstorage but reaches quota
            var cache = "BCRM_RR_CACHE_APPLET_" + an;
            if (typeof (BCRCMETACACHE[cache]) === "undefined") {
                rrdata = ut.GetRRData("Applet", an);
                appletdata = ut.ExtractAppletData(rrdata);
                ad = appletdata["Applet"];
                BCRCMETACACHE[cache] = JSON.stringify(ad);
            }
            else {
                ad = JSON.parse(BCRCMETACACHE[cache]);
            }
            return ad;
        };

        BCRMUtils.prototype.ShowControls = function (context) {
            var ut = new SiebelAppFacade.BCRMUtils();
            var pm = ut.ValidateContext(context);
            var an, apd, tp, cs, cn, uit, pop;
            var nl;
            if (pm) {
                pm.SetProperty("C_ToggleCycle", "ShowControls");
                an = pm.GetObjName();
                apd = ut.GetAppletData(an);
                tp = ut.GetAppletType(pm);
                //currently supporting form applets only
                if (tp == "form" || tp == "list") {
                    cs = pm.Get("GetControls");
                    for (c in cs) {
                        pop = "";
                        if (cs.hasOwnProperty(c) && c != "CleanEmptyElements") {
                            cn = c;
                            uit = cs[cn].GetUIType();
                            if (uit == "Mvg") {
                                if (typeof (apd["Controls"][cn]) !== "undefined") {
                                    pop = apd["Controls"][cn]["MVG Applet"];
                                    //get Assoc applet
                                    var mvgd = ut.GetAppletData(pop);
                                    var asa = mvgd["Associate Applet"];
                                    if (asa != "") {
                                        uit = "Shuttle";
                                        pop = asa + "<br>" + pop;
                                    }
                                }
                            }
                            if (uit == "Pick") {
                                if (typeof (apd["Controls"][cn]) !== "undefined") {
                                    pop = apd["Controls"][cn]["Pick Applet"];
                                }
                            }
                            if (uit == "Button") {
                                pop = cs[cn].GetMethodName();
                            }
                            else {
                                //nothing to do as of yet
                            }
                            nl = uit + ":" + cn;
                            if (pop != "") {
                                nl += "<br>" + pop;
                            }
                            ut.SetLabel(cs[cn], nl, pm);
                        }
                    }
                }
            }
        };

        //show physical metadata (table.column), requires BCRM RR Reader service
        BCRMUtils.prototype.ShowTableColumns = function (context) {
            var ut = new SiebelAppFacade.BCRMUtils();
            var pm = ut.ValidateContext(context);
            var table, column, mvlink, mvfield, mvbc, join;
            var bcd2;
            var bc, bcd, bcn, fm, cs, tp, fn, fd;
            var fdt, fln, fcl, frq;
            var nl;
            if (pm) {
                pm.SetProperty("C_ToggleCycle", "ShowTableColumns");
                bc = pm.Get("GetBusComp");
                bcn = bc.GetName();
                //get RR CLOB Data from BCRM RR Reader service
                bcd = ut.GetBCData(bcn);
                fm = bc.GetFieldMap();
                tp = ut.GetAppletType(pm);

                if (tp == "form" || tp == "list") {
                    cs = pm.Get("GetControls");
                    for (c in cs) {
                        if (cs.hasOwnProperty(c) && c != "CleanEmptyElements") {
                            var cn = c;
                            fn = cs[cn].GetFieldName();
                            if (fn != "") {
                                fd = fm[fn];
                                if (typeof (fd) !== "undefined") {
                                    fdt = fd.GetDataType(); //get the data type (text, bool, etc)
                                    fln = fd.GetLength(); //get the field length (30, 100, etc)
                                    frq = fd.IsRequired() ? "*" : ""; //get an asterisk when field is required, otherwise nothing
                                    fcl = fd.IsCalc() ? "C" : ""; //get a "C" when field is calculated, otherwise nothing
                                }
                                else {
                                    fdt = "";
                                    fln = "";
                                    frq = "";
                                    fcl = "";
                                }

                                if (typeof (bcd["Fields"][fn]) !== "undefined") {

                                    table = bcd["Table"];
                                    column = bcd["Fields"][fn]["Column"];

                                    //Join lookup
                                    if (bcd["Fields"][fn]["Join"] != "") {
                                        join = bcd["Fields"][fn]["Join"];
                                        if (typeof (bcd["Joins"][join]) !== "undefined") {
                                            table = bcd["Joins"][join]["Table"];
                                        }
                                        else {
                                            table = join;
                                        }
                                    }
                                    nl = table + "." + column;

                                    //calculated fields
                                    if (fcl == "C") {
                                        nl = "Calc: " + bcd["Fields"][fn]["Calculated Value"];
                                    }

                                    //multi-value fields
                                    if (bcd["Fields"][fn]["Multi Valued"] == "Y") {
                                        //debugger;
                                        mvlink = bcd["Fields"][fn]["Multi Value Link"];
                                        mvfield = bcd["Fields"][fn]["Dest Field"];
                                        if (typeof (bcd["Multi Value Links"][mvlink]) !== "undefined") {
                                            mvbc = bcd["Multi Value Links"][mvlink]["Destination Business Component"];
                                            bcd2 = ut.GetBCData(mvbc);
                                            if (typeof (bcd2["Fields"][mvfield]) !== "undefined") {
                                                table = bcd2["Table"];
                                                column = bcd2["Fields"][mvfield]["Column"];
                                                //Join lookup
                                                if (bcd2["Fields"][mvfield]["Join"] != "") {
                                                    join = bcd2["Fields"][mvfield]["Join"];
                                                    if (typeof (bcd2["Joins"][join]) !== "undefined") {
                                                        table = bcd2["Joins"][join]["Table"];
                                                    }
                                                    else {
                                                        table = join;
                                                    }
                                                }
                                            }
                                        }
                                        //nl = "MVF: " + mvbc + "::" + mvfield;
                                        nl = "MVF: " + table + "." + column;
                                    }
                                }
                                //field not found in bcdata
                                else {
                                    //try experimental NEO access
                                    try {
                                        var neo = ut.GetNEOData(bcn, fn);
                                        if (typeof (neo["Fields"][fn]) !== "undefined") {
                                            table = neo["Fields"][fn]["Join"];
                                            column = neo["Fields"][fn]["Column"];
                                            nl = table + "." + column;
                                        }
                                        else {
                                            //display field info from OUI layer
                                            nl = "System: " + fn + " (" + fdt + "/" + fln + ")" + frq + fcl;
                                        }
                                    }
                                    catch (e) {
                                        nl = "System: " + fn + " (" + fdt + "/" + fln + ")" + frq + fcl;
                                    }
                                }
                                ut.SetLabel(cs[cn], nl, pm);
                            }
                        }
                    }
                }
            }
        }

        //the big equalizer function, always get a PM, no matter the input (almost)
        BCRMUtils.prototype.ValidateContext = function (inp) {
            var retval = false;
            try {
                var pm = null;
                var ap;
                //context might be an applet instance
                //the GetPModel function gives it away
                if (typeof (inp.GetPModel) === "function") {
                    pm = inp.GetPModel();
                }
                //or it is a PM already...
                else if (typeof (inp.OnControlEvent) === "function") {
                    pm = inp;
                }
                //... or a PR, then we can get the PM easily:
                else if (typeof (inp.GetPM) === "function") {
                    pm = inp.GetPM();
                }
                //...we do not like controls, but anyway...
                else if (typeof (inp.GetInputName) === "function") {
                    pm = inp.GetApplet().GetPModel();

                }
                //context is neither an applet, PM nor PR...
                //...but could be an id string such as "S_A1" or "Contact List Applet"
                else if (typeof (inp) === "string") {
                    var temp = inp;
                    var appletmap = SiebelApp.S_App.GetActiveView().GetAppletMap();
                    for (ap in appletmap) {
                        if (temp.indexOf("S_") === 0) {
                            if (appletmap[ap].GetPModel().Get("GetFullId") == inp) {
                                pm = appletmap[ap].GetPModel();
                            }
                        }
                        else { //assume it's the applet name
                            pm = appletmap[temp].GetPModel();
                        }
                    }
                }
                else {
                    throw ("BCRMUtils.ValidateContext: Could not equalize PM.");
                }
            }
            catch (e) {
                console.log(e.toString());
            }
            finally {
                retval = pm;
            }
            return retval;
        };

        //get applet type
        BCRMUtils.prototype.GetAppletType = function (context) {
            var retval = false;
            var type = null;
            var pm = null;
            var id = null;
            var an = "";
            var ut = new SiebelAppFacade.BCRMUtils();
            pm = ut.ValidateContext(context);
            if (pm) {
                if (typeof (pm.Get) === "function") {
                    if (pm.Get("GetListOfColumns")) {
                        retval = "list";
                        type = true;
                    }
                }
                id = pm.Get("GetFullId");
                if ($("#" + id).find(".siebui-tree").length != 0) { //it's a tree!
                    retval = "tree";
                    type = true;
                }
                else if (!type) {  //finding out whether it's a chart applet is tricky...
                    id = pm.Get("GetFullId").split("_")[1]; //chart applets have weird Ids
                    id = id.toLowerCase().charAt(0) + "_" + id.charAt(1);  //did I mention that they have weird Ids
                    if ($("#" + id).find(".siebui-charts-container").length != 0) {
                        retval = "chart"; //It's a Bingo! -- Do you say it like that? -- No, you just say 'Bingo!'.
                    }
                    else { //no list,tree or chart. 99% sure it's a form applet
                        retval = "form";
                    }
                }
                an = pm.GetObjName();
            }
            else {//not of this world...
                retval = "unknown"
            }
            //console.log("BCRMUtils.GetAppletType: " + an + " is a " + retval);
            return retval;
        };

        //get the applet DOM element
        BCRMUtils.prototype.GetAppletElem = function (context) {
            var retval = null;
            var ut = new SiebelAppFacade.BCRMUtils();
            var pm = ut.ValidateContext(context);
            var appletElem = null;
            if (pm) {
                var appletElemId = pm.Get("GetFullId");
                appletElem = $("#" + "s_" + appletElemId + "_div");
            }
            retval = appletElem;
            return retval;
        };
        return BCRMUtils;
    }());
}
//END XRAY21*******************************************************


//START xapuk.com utilities by Slava**********************************
//Kudos to Slava (xapuk.com)
BCRMClearCaches = function (silent) {
    var a = SiebelApp.S_App.GetActiveView().GetActiveApplet();
    a.InvokeMethod("ClearCTEventCache");
    a.InvokeMethod("ClearLOVCache");
    a.InvokeMethod("ClearResponsibilityCache");
    if (silent) {
        //silent
    }
    else {
        alert("Caches cleared:\nRuntime Events\nLOVs\nResponsibility");
    }
};

/* 
@desc advanced AboutView plugin
@author VB(xapuk.com)
@version 1.3 2018/07/10
*/
var BCRM_AV_id = "SiebelAboutView";

// template
var $d;
var tmp = '' +
    '<div title="About View" id = "<%= BCRM_AV_id%>">' +
    '<% var v = SiebelApp.S_App.GetActiveView() %>' +
    '<b>Application:</b> <a><%= SiebelApp.S_App.GetName() %></a><br>' +
    '<b>View:</b> <a><%= v.GetName() %></a><br>' +
    '<b>BusObject:</b> <a><%= SiebelApp.S_App.GetActiveBusObj().GetName() %></a><br>' +
    '<% if(v.GetActiveTask()) { %>' +
    '<b>Task:</b> <a><%= v.GetActiveTask() %></a><br>' +
    '<% } %>' +
    '<b>Applets(<%= Object.keys(v.GetAppletMap()).length %>) / BusComps(<%= Object.keys(SiebelApp.S_App.GetActiveBusObj().GetBCMap()).length %>):</b><br>' +
    '<ul style="padding-left:20px">' +
    '<% for(applet in v.GetAppletMap()) { var a = v.GetAppletMap()[applet]; var bc = a.GetBusComp(); var r = bc.GetSelection() < bc.GetRecordSet().length?bc.GetRecordSet()[bc.GetSelection()]:{}; var os = "SiebelApp.S_App.GetActiveView().GetAppletMap()[\'" + applet + "\']"; var $ds = $("#" + a.GetFullId()); %>' +
    '<li>' +
    '<a data-target="controls"><b style="<% if($ds.is(":hidden")){ %>font-style:italic;<% } if(a===v.GetActiveApplet()){ %>text-decoration:underline<% } %>"><%= applet %></b></a> / ' +
    '<a data-target="fields"><b><%= bc.GetName() %></b></a>' +
    '<ul id="controls" style="display:none">' +
    '<hr>' +
    '<b>Applet:</b> <a><%= a.GetName() %></a><br/>' +
    '<b>BusComp:</b> <a><%= bc.GetName() %></a><br/>' +
    '<b>Mode:</b> <a><%= a.GetMode() %></a><br/>' +
    '<b>Title:</b> <a><%= a.GetAppletLabel() %></a><br/>' +
    '<% if(a.GetToggleApplet()){ %>' +
    '<b>Toggle:</b> <a><%= a.GetToggleApplet() %></a><br/>' +
    '<% } %>' +
    '<b>Object Selector:</b> <a><%= os %></a><br>' +
    '<b>DOM Selector:</b> <a>$(\"<%= $ds.selector %>\")</a><br>' +
    '<b>Controls (<%= Object.keys(a.GetControls()).length %>): </b>' +
    '<ul>' +
    '<% for(control in a.GetControls()) { var c = a.GetControls()[control]; var $cds = $ds.find("[name=\'" + c.GetInputName() + "\']") %>' +
    '<li>' +
    '<a data-target="control"><b style="<% if($cds.is(":hidden")){ %>font-style:italic;<% } if(c===a.GetActiveControl()){ %>text-decoration:underline<% } %>"><%= c.GetDisplayName()||control %></b></a>' +
    '<ul id="control">' +
    '<hr>' +
    '<% if($cds.is(":visible") && $cds.is(":focusable")){ %>' +
    '<button data-eval="$(\'<%= $cds.selector %>\').focus()">Focus</button><br>' +
    '<% } %>' +
    '<b>Control:</b> <a><%= control %></a><br>' +
    '<% if(c.GetFieldName()){ %>' +
    '<b>Field:</b> <a><%= c.GetFieldName() %></a><br>' +
    '<% if(r){ %>' +
    '<b>Value:</b> <a><%= r[c.GetFieldName()] %></a><br>' +
    '<% } %>' +
    '<b>Immediate post changes:</b> <a><%= c.IsPostChanges() %></a><br>' +
    '<% } %>' +
    '<b>Type:</b> <a><%= c.GetUIType() %></a> <br>' + // to decode value trhough SiebelJS.Dependency("SiebelApp.Constants");
    '<b>Input:</b> <a><%= c.GetInputName() %></a><br>' +
    '<b>Object Selector:</b> <a><%= os+".GetControls()[\'" + control + "\']" %></a><br>' +
    '<b>DOM Selector:</b> <a>$(\"<%= $cds.selector %>\")</a><br>' +
    '<% if(c.GetMethodName()){ %>' +
    '<b>Method:</b> <a><%= c.GetMethodName() %></a><br>' +
    '<% } %>' +
    '<% if(c.GetPMPropSet() && c.GetPMPropSet().propArrayLen > 0){ %>' +
    '<b>User Props (<%= Object.keys(c.GetPMPropSet().propArray).length %>):</b><br>' +
    '<ul>' +
    '<% for(p in c.GetPMPropSet().propArray){ %>' +
    '<% if("string" === typeof c.GetPMPropSet().propArray[p]){ %>' +
    '<li><a><%= p %></a> = <a><%= c.GetPMPropSet().propArray[p] %> </a></li>' +
    '<% } %>' +
    '<% } %>' +
    '</ul>' +
    '<% } %>' +
    '<% if(c.GetMethodPropSet() && c.GetMethodPropSet().propArrayLen > 0){ %>' +
    '<b>Method PS (<%= Object.keys(c.GetMethodPropSet().propArray).length %>):</b>' +
    '<ul>' +
    '<% for(p in c.GetMethodPropSet().propArray){ %>' +
    '<% if("string" === typeof c.GetMethodPropSet().propArray[p]){ %>' +
    '<li><a><%= p %></a> = <a><%= c.GetMethodPropSet().propArray[p] %> </a></li>' +
    '<% } %>' +
    '<% } %>' +
    '</ul>' +
    '<% } %>' +
    '<hr>' +
    '</ul>' +
    '</li>' +
    '<% } %>' +
    '</ul>' +
    '<hr>' +
    '</ul>' +
    '<ul id="fields" style="display:none">' +
    '<hr>' +
    '<b>BusComp:</b> <%= bc.GetName() %><br/>' +
    '<% if(r && r.hasOwnProperty("Id")){ %>' +
    '<b>Row Id:</b> <a><%= r.Id %></a><br/>' +
    '<% } %>' +
    '<% if(r && r.hasOwnProperty("Created")){ %>' +
    '<b>Created:</b> <a><%= r.Created %></a><br/>' +
    '<% } %>' +
    '<% if(r && r.hasOwnProperty("Updated")){ %>' +
    '<b>Updated:</b> <a><%= r.Updated %></a><br/>' +
    '<% } %>' +
    '<b>Commit pending:</b> <%= bc.commitPending %><br/>' +
    '<b>Fields:</b> <%= Object.keys(bc.GetFieldList()).length %><br/>' +
    '<b>Row:</b> <%= bc.GetCurRowNum()==-1?0:bc.GetCurRowNum() %> of <%= bc.GetNumRows() %><%= bc.IsNumRowsKnown()?"":"+" %><br/>' +
    '<ul>' +
    '<% for(var f in r){ %>' +
    '<li><a><%= f %></a> = <a><%= r[f] %></a></li>' +
    '<% } %>' +
    '</ul>' +
    '<hr>' +
    '</ul>' +
    '</li>' +
    '<% } %>' +
    '</ul>' +
    '</div>';
function BCRMSiebelAboutView() {

    // to support single session
    $("#" + BCRM_AV_id).parent().remove();

    if ("undefined" === typeof EJS) {
        var src = "3rdParty/ejs/ejs_production";
        requirejs([src], BCRMSiebelAboutView, function () { alert("Failed to load EJS library ! \n" + src); });
    }

    var html = new EJS({ text: tmp }).render(SiebelApp.S_App);

    $d = $(html).dialog({
        modal: true,
        width: "1024",
        open: function () {
            // hide all expandable ULs by default
            $(this).find("li").find("ul[id]").hide();
            // attempt to copy span content (click)
            $(this).find("a").click(function () {
                BCRMAboutViewCopy(this);
            });
            // expand (right click)
            $(this).find("a").contextmenu(function () {
                $(this).siblings("#" + $(this).attr("data-target")).toggle();
                $(this).siblings("ul[id]:not([id='" + $(this).attr("data-target") + "'])").hide();
                return false;
            });
            // focus on control
            $(this).find("button").click(function () {
                var str = $(this).attr("data-eval");
                $d.dialog('close');
                eval(str);
            });
        },
        close: function () {
            $(this).dialog('destroy').remove();
        },
        buttons: [
            {
                text: 'Help',
                click: function () {
                    window.open("http://xapuk.com/index.php?topic=80", "_blank");
                }
            },
            {
                text: 'Copy (left click)',
                disabled: true
            },
            {
                text: 'Expand (right click)',
                disabled: true
            },
            {
                text: 'Close (esc)',
                click: function () {
                    $(this).dialog('close');
                }
            }
        ]
    });

    // styling
    $d.css("padding-left", "20px");
    $d.find("ul").css("padding-left", "20px");
    $d.find("hr").css("margin", "5px");
    $d.find("a").hover(function (e) {
        $(this).css({ "text-decoration": e.type == "mouseenter" ? "underline" : "none" });
    });
}

// copy value
function BCRMAboutViewCopy(scope) {
    // replacing link with intput and select the value
    var val = $(scope).text();
    $(scope).hide().after("<input id='" + BCRM_AV_id + "i'>");
    $d.find("#" + BCRM_AV_id + "i").val(val).select();
    // attempt to copy value
    if (document.execCommand("copy", false, null)) {
        // if copied, display a message for a second
        $d.find("#" + BCRM_AV_id + "i").attr("disabled", "disabled").css("color", "red").val("Copied!");
        setTimeout(function () {
            $d.find("#" + BCRM_AV_id + "i").remove();
            $(scope).show();
        }, 700);
    } else {
        // if failed to copy, leave input until blur, so it can be copied manually
        $d.find("#" + BCRM_AV_id + "i").blur(function () {
            $(this).remove();
            $d.find("a").show();
        });
    }
}

/* 
@desc Framework allowing to run/evaluate eScript code
@author VB(xapuk.com)
@version 1.3 2018/12/05
@requires BS=FWK Runtime to be published
*/
var BCRMeditor; // AceJS editor object
var BCRMfunc = "SiebelEvalScript"; // function identifier
var BCRMsnip; // an array of saved snippets
var BCRMlast; // current snippet name

BCRMScriptEditor = function () {

    if ("undefined" === typeof ace) {
        var src = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.2/ace.js";
        requirejs([src], BCRMScriptEditor, function () { alert("Failed to load ace library ! \n" + src); });
    }

    // dialog html
    var s = '<div title="eScript">'
        + '<select id = "' + BCRMfunc + 'List" style="display:block"><option value="*">New...</option></select>'
        + '<textarea id = "' + BCRMfunc + '" placeholder="eScript code..." style="height:150px"></textarea>'
        + '<label id = "' + BCRMfunc + '_lbl" for="' + BCRMfunc + '">Initialised</label>'
        + '<textarea id = "' + BCRMfunc + 'Out" rows="4" disabled></textarea>'
        + '<style>select,textarea{width:100%!Important}.ui-dialog-content{padding:0.5em 1em}</style>'
        + '</div>';

    // hard-remove dialog object from DOM, just in case
    $("#" + BCRMfunc + "List").parent().remove();

    var d = $(s).dialog({
        modal: true,
        width: 1024,
        open: function () {

            $('#' + BCRMfunc).focus();

            // load acejs plugin
            if ("undefined" === typeof ace) {
                var src = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.2/ace.js";
                requirejs([src], BCRMScriptEditor, function () { alert("Failed to load ace library ! \n" + src); });
            }
            else {
                BCRMattachACE();
            }

            // List onchange
            $("#" + BCRMfunc + "List").change(function (event) {
                var n = $(this).val();
                if (n != "*" && n > "") {
                    if (BCRMeditor) {
                        BCRMeditor.setValue(BCRMsnip[n]);
                    } else {
                        $("#" + BCRMfunc).text(BCRMsnip[n]);
                    }
                    window.localStorage[BCRMfunc + "Last"] = n;
                }

            });

            // key bindings
            $("#" + BCRMfunc + "Out").parent().keydown(function (event) {
                if (event.ctrlKey && event.keyCode === 13) { // ctrl + Enter
                    BCRMEval();
                    return false;
                } else if (event.ctrlKey && event.keyCode === 83) { // ctrl + S
                    BCRMSave();
                    return false;
                }
            });

            BCRMLoad(); // load presaved params

        },
        close: function () {
            $(this).dialog('destroy').remove();
        },
        buttons: [
            {
                text: 'Run (Ctrl+Enter)',
                click: BCRMEval
            },
            {
                text: 'Save (Ctrl + S)',
                click: BCRMSave
            },
            {
                text: 'Remove',
                click: BCRMDelete
            },
            {
                text: 'Close (Esc)',
                click: function () {
                    $(this).dialog('close');
                }
            }
        ]
    });
}



BCRMEval = function () {

    var sExpr = BCRMGetCode();
    var sRes = "";
    var dTS = new Date();
    var isChrome = !!window.chrome;
    var isFirefox = typeof InstallTrigger !== 'undefined';

    // execution timestamp
    $('#' + BCRMfunc + "_lbl").text("Last executed at " + dTS.toISOString().replace("T", " ").replace("Z", " "));

    BCRMSave(); // save snippets every time you run it

    // invoke BS
    var service = SiebelApp.S_App.GetService("FWK Runtime");
    var ps = SiebelApp.S_App.NewPropertySet();
    ps.SetProperty("Expr", sExpr);
    var outputSet = service.InvokeMethod("EvalScript", ps);
    if (outputSet.GetProperty("Status") == "Error") {
        sRes = outputSet.GetChildByType("Errors").GetChild(0).GetProperty("ErrMsg");
    } else {
        sRes = outputSet.GetChildByType("ResultSet").GetProperty("Result");
    }
    $('#' + BCRMfunc + "Out").text(sRes);

    // show results in browser console
    if (console) {
        var a = sRes.split(String.fromCharCode(13));
        for (var i = 0; i < a.length; i++) {
            // split into 3 parts for styling
            var a2 = a[i].split('\t|\t');
            var s1 = "", s2 = "", s3 = "";
            if (a2.length > 1) {
                if (a2.length > 2) {
                    s1 = a2[0];
                    s2 = a2[1];
                    for (var j = 2; j < a2.length; j++) {
                        s3 += "\t" + a2[j];
                    }
                } else {
                    s1 = a2[0];
                    s3 = a2[1];
                }
            } else {
                s3 = a[i];
            }

            // collapse miltiline results
            if (s3.indexOf("\n") > -1) {
                if (isFirefox || isChrome) {
                    console.groupCollapsed("%c" + s1 + " \t%c" + s2, "color:DarkCyan;", "color:Maroon;font-weight:bold");
                } else {
                    console.groupCollapsed(s1 + " \t" + s2);
                }
                console.log(s3);
                console.groupEnd();
            } else {
                if (isFirefox || isChrome) {
                    console.log("%c" + s1 + " \t%c" + s2 + " \t%c" + s3, "color:DarkCyan;", "color:Maroon;font-weight:bold", "color:black;font-weight:normal");
                } else {
                    console.log(s1 + " \t" + s2 + " \t" + s3);
                }
            }
        }
    }
}

// attach acejs plugin
BCRMattachACE = function () {
    if ("undefined" === typeof ace) {
        var src = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.2/ace.js";
        requirejs([src], BCRMScriptEditor, function () { alert("Failed to load ace library ! \n" + src); });
    }
    BCRMeditor = ace.edit(BCRMfunc);
    BCRMeditor.session.setMode("ace/mode/javascript");
    $(".ace_editor").css("height", "300");
}

// save button
BCRMSave = function () {
    var n = $('#' + BCRMfunc + "List").val();
    if (n == "*" || n == null) { // new
        n = prompt("Snippet name");
        if (n) {
            if (n.match(/.{2,}/)) {
                BCRMsnip[n] = BCRMGetCode(true);
                window.localStorage[BCRMfunc] = JSON.stringify(BCRMsnip);
                $('#' + BCRMfunc + "List").append('<option value="' + n + '">' + n + '</option>');
                $('#' + BCRMfunc + "List").val(n).change();
            } else {
                alert("Invalid snippet name!");
            }
        }
    } else { // existing
        BCRMsnip[n] = BCRMGetCode(true);
        window.localStorage[BCRMfunc] = JSON.stringify(BCRMsnip);
    }
}

// Remove button
BCRMDelete = function () {
    var n = $('#' + BCRMfunc + "List").val();
    if (confirm("Are you sure you want to delete a snippet: " + n)) {
        if (n && n != "*") {
            delete BCRMsnip[n]; // remove item
            window.localStorage[BCRMfunc] = JSON.stringify(BCRMsnip);
            delete window.localStorage[BCRMfunc + "Last"];
            BCRMLoad(); // reload list
        }
    }
}

// loads preserved code snippets
BCRMLoad = function () {

    var s = window.localStorage[BCRMfunc];

    // remove all dropdown items
    $("#" + BCRMfunc + "List option").remove();

    //clear editor
    if (BCRMeditor) {
        BCRMeditor.setValue("");
    } else {
        $("#" + BCRMfunc).text("");
    }

    // retrieve code snippets saved in local storage
    var li = '';
    if (s) {
        BCRMsnip = JSON.parse(s);
        for (k in BCRMsnip) {
            li += '<option value="' + k + '">' + k + '</option>';
        }
    } else {
        BCRMsnip = {};
    }
    $("#" + BCRMfunc + "List").append(li);

    //last snippet
    BCRMlast = window.localStorage[BCRMfunc + "Last"];
    if (BCRMlast) {
        $('#' + BCRMfunc + "List").val(BCRMlast).change();
    }
}

// returns either selected peace of code or full value from text area or ACEJS plugin
BCRMGetCode = function (bFull) {
    var sRes;
    if (BCRMeditor) {
        if (bFull || BCRMeditor.getSelectedText() === "") {
            sRes = BCRMeditor.getValue();
        } else {
            sRes = BCRMeditor.getSelectedText();
        }
    } else {
        var textComponent = document.getElementById(BCRMfunc);
        if (bFull) {
            sRes = $('#' + BCRMfunc).val();
        } else if (textComponent.selectionStart !== undefined && textComponent.selectionStart != textComponent.selectionEnd) {// Normal browsers
            sRes = textComponent.value.substring(textComponent.selectionStart, textComponent.selectionEnd);
        } else if (document.selection !== undefined) {// IE
            textComponent.focus();
            var sel = document.selection.createRange();
            sRes = sel.text;
        } else {
            sRes = $('#' + BCRMfunc).val();
        }
    }
    return sRes;
}

/* 
@desc UI allowing to evaluate expressions (EvalExpr) on active BCs
@author VB(xapuk.com)
@version 1.3 2019/03/10
@requires BS "FWK Runtime" to be compiled and published
*/

var BCRMExprfunc = "SiebelEvalExpr";
var bBeauty = false;

BCRMExprEditor = function () {

    require(["3rdParty/SiebelQueryLang"], function (e) {
        console.log("Beautifier loaded!");
    });
    $("#" + BCRMExprfunc).parent().remove();
    var a = BCRMLoadBCs();
    if (a.length === 0) {
        alert("No BusComps/Records available!");
    } else {

        var s = '<div title="Runtime calculations">' +
            '<label for="' + BCRMExprfunc + 'List">Business Component:</label>' +
            '<select id = "' + BCRMExprfunc + 'List" style="display:block"></select>' +
            '<label for="' + BCRMExprfunc + '">Expression:</label>' +
            '<textarea id = "' + BCRMExprfunc + '" rows="5" nowrap></textarea>' +
            '<label for="' + BCRMExprfunc + 'Out">Results:</label>' +
            '<textarea id = "' + BCRMExprfunc + 'Out" disabled rows="2"></textarea>' +
            '<style type="text/css">.ui-dialog textarea, .ui-dialog select {height:auto; width:100%; margin-bottom:10px} .ui-dialog label{margin-top:20px!}</style>'
        '</div>';

        var d = $(s).dialog({
            modal: true,
            width: 1024,
            heigth: 640,
            open: function () {
                $('#' + BCRMExprfunc).focus();

                // key bindings
                $("#" + BCRMExprfunc + "Out").parent().keydown(function (event) {
                    if (event.ctrlKey && event.keyCode === 13) { // ctrl + Enter
                        BCRMEvalExpr();
                    }
                });

                // list of BCs
                $("#" + BCRMExprfunc + "List").append("<option>" + a.join("</option><option>") + "</option>");
                $("#" + BCRMExprfunc + "List").val(SiebelApp.S_App.GetActiveView().GetActiveApplet().GetBusComp().GetName());

                // recent expression
                $("#" + BCRMExprfunc).val(JSON.parse(window.localStorage[BCRMExprfunc]));

            },
            close: function () {
                $(this).dialog('destroy').remove();
            },
            buttons: [
                {
                    text: 'Format/Linarise',
                    click: BCRMBeauty,
                    id: 'BeautyBtn'
                }, {
                    text: 'Run (Ctrl+Enter)',
                    click: BCRMEvalExpr
                }, {
                    text: 'Close (Esc)',
                    click: function () {
                        $(this).dialog('destroy').remove();
                    }
                }
            ]
        });

        // bind and trigger auto-adjust
        $(d).find("#" + BCRMExprfunc).keyup(function () {
            BCRMTextAdjust(this, 5);
        }).keyup();

        // bind a beautifier
        $(".ui-dialog #BeautyBtn").hide();
        require(["3rdParty/SiebelQueryLang"], function (e) {
            console.log("Beautifier loaded!");
            $(".ui-dialog #BeautyBtn").show();
        });
    }
}

BCRMBeauty = function () {
    var s = $('#' + BCRMExprfunc).val();
    if (s) {
        if (bBeauty) {
            // linarise
            s = s.replace(/\n(\t|\s)*/gm, "");
            $('#' + BCRMExprfunc).val(s).attr("wrap", "on");
            bBeauty = false;

        } else {
            // beautify
            try {
                var o = SiebelQueryLang.parse(s);
                s = BCRMtrav(o.expression, "");
                $('#' + BCRMExprfunc).val(s).attr("wrap", "off");
                bBeauty = true;
            } catch (e) {
                // silence the error
                console.log(e);
            }
        }
        BCRMTextAdjust($('#' + BCRMExprfunc)[0]);
    }
}

BCRMtrav = function (o, t, f) {
    var r = "";
    if ("object" === typeof o) {
        var p = o.par;
        var n = o.not;

        if (o.type === "bin") {
            r = BCRMtrav(o.left, t) + " " + o.operator + " " + BCRMtrav(o.right, t);
        } else if (o.type === "log") {
            if (p) { // format logical operators eclosed in brackets
                tt = t + "\t";
                r = "(\n";
                r += tt + BCRMtrav(o.left, tt, true);
                r += "\n" + tt + o.operator + " " + BCRMtrav(o.right, tt, true);
                r += "\n" + t + ")";
                p = false;
            } else {
                if (f) {
                    r = BCRMtrav(o.left, t, true);
                    r += "\n" + t + o.operator + " " + BCRMtrav(o.right, t, true);
                } else {
                    r = BCRMtrav(o.left, t) + " " + o.operator + " " + BCRMtrav(o.right, t);
                }
            }
        } else if (o.type === "func") {
            var l = o.arguments.length;
            var f = l > 2; // split params when more then 2
            var s = (f ? "\n" + t : "");
            var st = (f ? s + "\t" : "");
            r = o.name + "(";
            o.arguments.forEach(function (a, i) {
                r += st + BCRMtrav(a, t + "\t") + (i < l - 1 ? ", " : "");
            });
            r += s + ")";
        } else if (o.type === "field") {
            r = "[" + o.field + "]";
        } else if (o.type === "param") {
            r = "[&" + o.param + "]";
        } else if (o.type === "num") {
            r = o.value;
        } else if (o.type === "str") {
            r = '"' + o.value + '"';
        }

        if (p) {
            r = "(" + r + ")";
        }
        if (n) {
            r = "NOT " + r;
        }

    } else {
        r = o;
    }
    return r;
}


BCRMEvalExpr = function () {

    var sExpr = $('#' + BCRMExprfunc).val();
    var sRes = "";

    // save last query
    window.localStorage[BCRMExprfunc] = JSON.stringify(sExpr);

    // if there is a selection
    var ele = document.getElementById(BCRMExprfunc);
    if (ele.selectionStart !== undefined && ele.selectionStart != ele.selectionEnd) {// Normal browsers
        sExpr = ele.value.substring(ele.selectionStart, ele.selectionEnd);
    } else if (document.selection !== undefined) {// IE
        ele.focus();
        var sel = document.selection.createRange();
        sExpr = sel.text;
    }

    // invoke BS
    var service = SiebelApp.S_App.GetService("FWK Runtime");
    var ps = SiebelApp.S_App.NewPropertySet();
    ps.SetProperty("Expr", sExpr);
    ps.SetProperty("BC", $("#" + BCRMExprfunc + "List").val());
    var outputSet = service.InvokeMethod("EvalExpr", ps);
    if (outputSet.GetProperty("Status") == "Error") {
        sRes = outputSet.GetChildByType("Errors").GetChild(0).GetProperty("ErrMsg");
    } else {
        sRes = outputSet.GetChildByType("ResultSet").GetProperty("Result");
        console.log(outputSet);
    }
    BCRMTextAdjust($('#' + BCRMExprfunc + "Out").show().text(sRes)[0]);
}

// auto-ajust textarea height
BCRMTextAdjust = function (scope, minrows, maxrows) {

    maxrows = maxrows > 0 ? maxrows : 30;
    minrows = minrows > 0 ? minrows : 5;
    var txt = scope.value;
    var cols = scope.cols;

    var arraytxt = txt.split('\n');
    var rows = arraytxt.length;

    if (rows > maxrows) {
        scope.rows = maxrows;
    } else if (rows < minrows) {
        scope.rows = minrows;
    } else {
        scope.rows = rows;
    }
}

// put active BC in the list with active applet's bc as selected
BCRMLoadBCs = function () {
    var a = [];
    for (var i in SiebelApp.S_App.GetActiveBusObj().GetBCMap()) {
        var bc = SiebelApp.S_App.GetActiveBusObj().GetBCMap()[i];
        if (a.indexOf(bc.GetName()) == -1 && bc.GetNumRows() > 0) {
            a.push(bc.GetName());
        }
    }
    return a;
}
//END xapuk.com utilities by Slava**********************************

//run srvrmgr commands, requires BCRM Server Manager Business Service
BCRMSrvrMgr = function (command, fromdialog) {
    if (typeof (command) === "undefined") {
        command = SiebelApp.Utils.Prompt("Enter a valid srvrmgr command.\nSeparate commands with \\n.", "list comps");
    }
    //separate commands with \n
    //command examples: "list comps", "list servers\nlist comps", "change param sarmlevel=2 for comp sccobjmgr_enu server server01"

    var svc = SiebelApp.S_App.GetService("FWK Runtime");
    var ips = SiebelApp.S_App.NewPropertySet();
    ips.SetProperty("cmd", command);
    ips.SetProperty("FilePath", devpops_config.ses_home + "\\TEMP\\");
    //set longer sleep time if output is not as desired
    ips.SetProperty("FileSleepTime", "5000");
    var ops = svc.InvokeMethod("srvrmgr", ips);
    var value = ops.GetChildByType("ResultSet").GetValue();
    //$("body").css("cursor","");
    if (!fromdialog) {
        var cm = $("<div id='bcrm_cm'>");
        var dlg = $("<div style='overflow:auto;'>");
        dlg.append(cm);
        dlg.dialog({
            title: "Server Manager Output",
            width: 1200,
            height: 800,
            buttons: {
                Submit: function () {
                    var output = BCRMSrvrMgr($("#bcrm_sm_ta").val(), true);
                    $("#bcrm_cm").find(".CodeMirror")[0].CodeMirror.setValue(output);
                },
                Close: function (e, ui) {
                    $(this).dialog("destroy");
                }
            },
            close: function (e, ui) {
                $(this).dialog("destroy");
            }

        });

        setTimeout(function () {
            CodeMirror($("#bcrm_cm")[0], {
                value: value,
                mode: "txt",
                lineNumbers: true
            });
            $("#bcrm_cm").children("div").css("height", "500px");

            //enhance dialog
            var c = $("<div id='bcrm_sm_c' style='margin-top:6px;'>");
            c.append("<textarea placeholder='Enter srvrmgr commands in separate lines and click Submit.' id='bcrm_sm_ta' style='width:800px;height:100px'>");
            $("#bcrm_cm").after(c);
        }, 100);
    }
    else {
        return value;
    }
}

//Demo: enable SARM
var sarmduration = 0;
var sarmintv;
BCRMSARMOn = function () {
    //get input
    var logdir, comp, server, duration;
    if (typeof (localStorage.BCRM_OPT_StartSARM_FilePath) !== "undefined") {
        logdir = localStorage.BCRM_OPT_StartSARM_FilePath;
    }
    else {
        fp = devpops_config.ses_home + "\\temp";
    }
    if (typeof (localStorage.BCRM_OPT_StartSARM_Component) !== "undefined") {
        comp = localStorage.BCRM_OPT_StartSARM_Component;
    }
    else {
        comp = "sccobjmgr_enu";
    }
    if (typeof (localStorage.BCRM_OPT_StartSARM_Server) !== "undefined") {
        server = localStorage.BCRM_OPT_StartSARM_Server;
    }
    else {
        server = "server01";
    }
    if (typeof (localStorage.BCRM_OPT_StartSARM_Duration) !== "undefined") {
        duration = 1000 * parseInt(localStorage.BCRM_OPT_StartSARM_Duration);
    }
    else {
        duration = 300000;
    }

    sarmduration = duration;
    var period = "1";
    var sarmuser = SiebelApp.S_App.GetUserName();
    var level = "2";

    var cmd = "";
    cmd += "set server " + server + "\n";
    cmd += "change param sarmlogdirectory=" + logdir + " for comp " + comp + "\n";
    cmd += "change param sarmperiod=" + period + " for comp " + comp + "\n";
    cmd += "change param sarmusers=" + sarmuser + " for comp " + comp + "\n";
    cmd += "change param sarmlevel=" + level + " for comp " + comp + "\n";
    cmd += "list param sarm% for comp " + comp + "\n";
    cmd += "list advanced param sarm% for comp " + comp + "\n";
    cmd += "unset server";

    BCRMSrvrMgr(cmd);
    sarmintv = setInterval(function () {
        sarmduration = sarmduration - 1000;
        var disp = sarmduration / 1000;
        $("#bcrm_sarm_msg").text("Logging SARM data for " + disp + " seconds");
        if (sarmduration <= 0) {
            BCRMSARMOff();
            sessionStorage.BCRMSARMCycle = "StopSARM";
            clearInterval(sarmintv);
            $("#bcrm_debug_msg").text("");
        }
    }, 1000);
};

//Demo: disable SARM
BCRMSARMOff = function () {
    var comp, server;
    if (typeof (localStorage.BCRM_OPT_StartSARM_Server) !== "undefined") {
        server = localStorage.BCRM_OPT_StartSARM_Server;
    }
    else {
        server = "server01";
    }
    if (typeof (localStorage.BCRM_OPT_StartSARM_Component) !== "undefined") {
        comp = localStorage.BCRM_OPT_StartSARM_Component;
    }
    else {
        comp = "sccobjmgr_enu";
    }
    var cmd = "";
    cmd += "delete parameter override for server " + server + " component " + comp + " param sarmperiod" + "\n";
    cmd += "delete parameter override for server " + server + " component " + comp + " param sarmlogdirectory" + "\n";
    cmd += "delete parameter override for server " + server + " component " + comp + " param sarmusers" + "\n";
    cmd += "delete parameter override for server " + server + " component " + comp + " param sarmlevel" + "\n";
    cmd += "list param sarm% for comp " + comp + "\n";
    cmd += "list advanced param sarm% for comp " + comp + "\n";

    BCRMSrvrMgr(cmd);
};

//SARM Demo
BCRMShowSARM = function (type, sarmcmd, ofile) {
    var cmd = "";
    var labels = [];
    var data = [];
    var labelfound = false;
    var datafound = false;
    var sarmquery = devpops_config.ses_home + "\\BIN\\sarmquery";
    var sarminp = devpops_config.ses_home + "\\TEMP";
    var sarmuser = SiebelApp.S_App.GetUserName();
    if (typeof (ofile) === "undefined") {
        ofile = sarminp + "\\" + sarmuser + "_out.txt";
    }
    if (typeof (sarmcmd) === "undefined") {
        sarmcmd = sarmquery + " -inp " + sarminp;
        if (typeof (localStorage.BCRM_OPT_ShowSARM_StartTime) !== "undefined") {
            if (localStorage.BCRM_OPT_ShowSARM_StartTime != "") {
                sarmcmd += " -sel starttime=\"" + localStorage.BCRM_OPT_ShowSARM_StartTime + "\"";
            }
        }
        if (typeof (localStorage.BCRM_OPT_ShowSARM_EndTime) !== "undefined") {
            if (localStorage.BCRM_OPT_ShowSARM_EndTime != "") {
                sarmcmd += " -sel endtime=\"" + localStorage.BCRM_OPT_ShowSARM_EndTime + "\"";
            }
        }
        if (typeof (localStorage.BCRM_OPT_ShowSARM_GroupBy) !== "undefined") {
            if (localStorage.BCRM_OPT_ShowSARM_GroupBy == "workflow") {
                sarmcmd += " -sel area=workflow -sel tree=all -agg instance";
            }
            else {
                sarmcmd += " -agg " + localStorage.BCRM_OPT_ShowSARM_GroupBy;
            }
        }
        else {
            sarmcmd += " -agg subarea";
        }
    }
    cmd = sarmcmd + " > " + ofile;
    var sarmstats = "";
    if (BCRMRunCmd(cmd)) {
        sarmstats = BCRMReadFile(ofile, 3000)
    }
    if (typeof (type) === "undefined") {
        if (typeof (localStorage.BCRM_OPT_ShowSARM_Type) !== "undefined") {
            type = localStorage.BCRM_OPT_ShowSARM_Type;
        }
        else {
            type = "text";
        }
    }
    if (type == "text") {
        return sarmstats + "\n\n" + sarmcmd;
    }
    if (type == "classic") {
        $("#sarm_stats").remove();
        var ct = $("<div id='sarm_stats' style='overflow:auto;'><pre>" + sarmstats + "</pre></div>");
        ct.append("<div id='sarm_cmd'>" + sarmcmd + "</div>");
        ct.dialog({
            width: 1000,
            height: 800
        });
    }
    if (type == "chart") {
        var t = sarmstats.split("\n");
        for (var i = 5; i < t.length; i++) {
            labelfound = false;
            datafound = false;
            var s;
            if (localStorage.BCRM_OPT_ShowSARM_GroupBy == "workflow") {
                s = t[i].split("  ");
            }
            else {
                s = t[i].split(" ");
            }
            for (var k = 0; k < s.length; k++) {
                if (!labelfound && s[k] != "") {
                    labelfound = true;
                    labels.push(s[k]);
                }
                else if (labelfound && !datafound && s[k] != "") {
                    datafound = true;
                    data.push(parseFloat(s[k]));
                }
            }
        }
        BCRMChartEngine("SARM Stats", "horizontalBar", labels, data);
        $("#bcrm_chart").dialog({
            width: 1000,
            height: 800,
            modal: false
        });
        setTimeout(function () {
            $("#bcrm_chart").append("<div id='sarm_cmd'>" + sarmcmd + "</div>");
        }, 100);
    }
};

//run command line on Siebel Server, requires System Preference: Runtime Scripts System Access = TRUE
BCRMRunCmd = function (cmd) {
    var svc = SiebelApp.S_App.GetService("FWK Runtime");
    var ips = SiebelApp.S_App.NewPropertySet();
    var ops = SiebelApp.S_App.NewPropertySet();
    ips.SetProperty("cmd", cmd);
    ops = svc.InvokeMethod("runcmd", ips);
    if (ops.GetProperty("Status") == "OK") {
        return true;
    }
    else {
        return false;
    }
};
//retrieve text files from server
BCRMReadFile = function (filepath, sleeptime) {
    var svc = SiebelApp.S_App.GetService("FWK Runtime");
    var ips = SiebelApp.S_App.NewPropertySet();
    var ops = SiebelApp.S_App.NewPropertySet();
    var content = "";
    ips.SetProperty("FileName", filepath);
    if (typeof (sleeptime) !== "undefined") {
        ips.SetProperty("FileSleepTime", sleeptime);
    }

    ops = svc.InvokeMethod("readFile", ips);
    if (ops.GetProperty("Status") == "OK") {
        content = ops.GetChildByType("ResultSet").GetValue();
    }
    else {
        content = ops.GetProperty("Status");
    }
    return content;
};

//popup catcher: this uses a PW to trigger on popup applets only, could be a PR
if (typeof (SiebelAppFacade.BCRMPopupPW) === "undefined") {

    SiebelJS.Namespace("SiebelAppFacade.BCRMPopupPW");
    define("siebel/custom/BCRMPopupPW", ["siebel/pwinfra"],
        function () {
            SiebelAppFacade.BCRMPopupPW = (function () {

                function BCRMPopupPW(pm) {
                    SiebelAppFacade.BCRMPopupPW.superclass.constructor.apply(this, arguments);
                }
                SiebelJS.Extend(BCRMPopupPW, SiebelAppFacade.FieldPW);

                BCRMPopupPW.prototype.Init = function () {
                    SiebelAppFacade.BCRMPopupPW.superclass.Init.apply(this, arguments);
                }

                BCRMPopupPW.prototype.ShowUI = function () {
                    SiebelAppFacade.BCRMPopupPW.superclass.ShowUI.apply(this, arguments);

                    //register PM Tracing for all current applets in view, including popups
                    BCRMRegisterPMTracing();

                    //xray handler
                    setTimeout(function () {
                        BCRMApplyDefaultXray();
                        var am = SiebelApp.S_App.GetActiveView().GetAppletMap();
                        var ut = new SiebelAppFacade.BCRMUtils();
                        for (a in am) {
                            ut.AddXrayHandler(a);
                        }
                    }, 300);
                }
                return BCRMPopupPW;
            }()
            );

            SiebelApp.S_App.PluginBuilder.AttachPW(consts.get("SWE_CTRL_TEXT"), SiebelAppFacade.BCRMPopupPW, function (control, objName) {
                var retval = false;
                if (SiebelApp.S_App.GetName() != "Siebel Web Tools") {
                    //only attach to popup applets which include inline search
                    //could find a better way, like applet type="popup"
                    if (control.GetName() == "PopupQuerySrchspec") {
                        retval = true;
                    }
                }
                return retval;
            });
            return "SiebelAppFacade.BCRMPopupPW";
        })
}

BCRMsleep = function (ms) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < ms);
}

//Test function
BCRMdevpopsTest = function (mode) {
    var v1 = "ISS Product Administration View";
    var st = 2000;
    if (mode == "xray") {
        st = 200;
    }
    var btn = $($("#bcrm_debug ul li")[0]);
    var tests = {
        "ShowControls": {
            mn: "#ShowControls div",
            tc: "#FINS_Name_Label_2",
            tt: "text",
            asrt: "JText:FINS Name",
            pass: false
        },
        "ShowBCFields": {
            mn: "#ShowBCFields div",
            tc: "#FINS_Name_Label_2",
            tt: "text",
            asrt: "Name (text/100)*",
            pass: false
        },
        "ShowTableColumns": {
            mn: "#ShowTableColumns div",
            tc: "#FINS_Name_Label_2",
            tt: "text",
            asrt: "S_PROD_INT.NAME",
            pass: false
        },
        "Reset": {
            mn: "#Reset div",
            tc: "#FINS_Name_Label_2",
            tt: "text",
            asrt: "Product",
            pass: false
        }
    };

    BCRCMETACACHE = {};

    for (t in tests) {
        if (mode == "xray") {
            var ts = "ShowControls,ShowBCFields,ShowTableColumns,Reset";
            if (ts.indexOf(t) == -1) {
                break;
            }
        }
        //SiebelApp.S_App.GotoView(v1);
        console.log("Executing Test: " + t);
        btn.click();
        BCRMsleep(st);
        $(tests[t].mn).click();
        BCRMsleep(st);
        if (mode != "xray") {
            if ($(tests[t].tc).text() == tests[t].asrt) {
                tests[t].pass = true;
                console.log("Test " + t + " passed successfully");
            }
            else {
                console.log("Test " + t + " failed");
            }
        }
    }
    console.log(tests);
}

//chart.js Demo
BCRMChartEngine = function (id, type, labels, data) {
    //try BCRMChartEngine("Revenue","horizontalBar",["Jan","Feb","Mar","Apr","May"],[100,150,75,70,110]);
    //see chartjs.org for details
    $("#bcrm_chart").remove();
    $("body").append("<div id='bcrm_chart' style='display:none;'><canvas id='" + id + "'></canvas></div>");
    var ctx = document.getElementById(id).getContext('2d');
    var chart = new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: id,
                backgroundColor: 'rgb(82, 119, 184)',
                borderColor: 'rgb(221, 221, 221)',
                data: data
            }]
        },
        options: {}
    });
};

//expression runner
BCRMQuickEval = function (expr, bo, bc) {
    var svc = SiebelApp.S_App.GetService("FWK Runtime");
    var ips = SiebelApp.S_App.NewPropertySet();
    var ops = SiebelApp.S_App.NewPropertySet();
    if (typeof (bo) === "undefined") {
        bo = "Account";
    }
    if (typeof (bc) === "undefined") {
        bc = "Account";
    }
    ips.SetProperty("Expr", expr);
    ips.SetProperty("BO", bo);
    ips.SetProperty("BC", bc);
    ops = svc.InvokeMethod("EvalExpr", ips);
    return ops.GetChildByType("ResultSet").GetProperty("Result");
};
//get responsibilities of current user
BCRMGetResps = function () {
    return BCRMQuickEval("GetProfileAttrAsList(\"User Responsibilities\")");
};

//Really Free Grid Layout (from Siebel2Phone, simplified)
if (typeof (SiebelAppFacade.BCRMRWDFactory) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.BCRMRWDFactory");

    SiebelAppFacade.BCRMRWDFactory = (function () {
        function BCRMRWDFactory(options) { }

        BCRMRWDFactory.prototype.BCRMMakeGridResponsive = function (pm) {

            var utils = new SiebelAppFacade.BCRMUtils();
            var ts = Date.now();
            var exp = false;  //switch to export applet layout to conf object

            pm = utils.ValidateContext(pm);
            var ae = utils.GetAppletElem(pm);
            var tb = ae.find("table.GridBack");
            var an = pm.GetObjName();
            //console.log("BCRMRWDFactory.BCRMMakeGridResponsive: " + an);
            var vn = SiebelApp.S_App.GetActiveView().GetName();
            var cname = an + "__" + vn;

            //start
            if (true) {
                var appletconfig = this.GetConfig(pm);
                var newgriddiv = this.GetResponsiveGrid(pm, appletconfig);
            }

            //insert responsive grid
            tb.before(newgriddiv);
            //hide original table
            tb.hide();
            var acconf = {
                collapsible: true,
                active: 0,
            };
            //ae.find("#bcrm_section_container").accordion(acconf);
            setTimeout(function () {
                ae.find("#bcrm_section_container").find(".ui-accordion-content").each(function (x) {
                    $(this).css({
                        "display": "grid",
                        "grid-template-columns": "repeat(auto-fit, 245px)",
                        "grid-auto-flow": "dense",
                        "row-gap": "4px",
                        "margin-left": "4px",
                        "height": "none"
                    });
                    $(this).find("input").attr("style", "width:240px!important;");
                    $(this).find("textarea").attr("style", "width:240px!important;height:30px!important");
                    $(this).find(".bcrm-new-grid-wrap .mceGridLabel").css("text-align", "left");
                    ae.find("#bcrm_section_container").find("h3").css("background", "linear-gradient(90deg, #d2e9f5, transparent)");
                });
                setTimeout(function () {
                    ae.find("#bcrm_section_container").find("h3").each(function (i) {
                        ae.find("#bcrm_section_container").accordion("option", "active", i);
                    });
                    ae.find("#bcrm_section_container").accordion("option", "active", 0);
                    if (ae.find("#bcrm_section_container").find("h3").length == 1) {
                        ae.find("#bcrm_section_container").find("h3").hide();
                    }
                }, 20)
            }, 20);

            //console.log("BCRMRWDFactory.BCRMMakeGridResponsive.Performance: " + an + " : " + (Date.now() - ts) + " ms.");
            //console.log("Applet '" + an + "' is now responsive. This took " + (Date.now()-ts) + " ms.");
            if (exp) {
                var x = {};
                x[cname] = appletconfig;
                prompt("Copy Applet Configuration to Clipboard", JSON.stringify(x));
            }
        };
        BCRMRWDFactory.prototype.Reset = function (a) {
            //console.log("BCRMRWDFactory.Reset");
            var utils = new SiebelAppFacade.BCRMUtils();
            var pm = utils.ValidateContext(a);
            var ae = utils.GetAppletElem(pm);
            var tb = ae.find("table.GridBack");
            var ng = ae.find("#bcrm_new_grid");
            if (ng.length == 1) {
                $(ng).find("[data-iname]").each(function (i) {
                    var iname = $(this).attr("data-iname");
                    var type = $(this).attr("data-btype");
                    var t = $(this).detach();
                    $(tb).find("#" + type + "[data-iname='" + iname + "']").before(t);
                });
                $(ng).remove();
                tb.show();
                tb.find(".mceGridLabel").attr("style", "");
            }
        };

        BCRMRWDFactory.prototype.GetResponsiveGrid = function (a, appletconfig) {
            //3rd pass
            //now create sections and collect controls
            var acconf = {
                collapsible: true,
                active: false,
                heightStyle: "content"
            };
            var utils = new SiebelAppFacade.BCRMUtils();
            var pm = utils.ValidateContext(a);
            var ae = utils.GetAppletElem(pm);
            var tb = ae.find("table.GridBack");
            var cs = pm.Get("GetControls");
            var lbl = [];
            var fld = [];
            var lblid = "";
            var an = pm.GetObjName();
            //console.log("BCRMRWDFactory.GetResponsiveGrid: " + an);
            var newgriddiv = $("<div id='bcrm_new_grid' class='bcrm-new-grid'></div>");  //the top container for the "new" grid, replacing the table
            var wrapdiv = "<div class='bcrm-new-grid-wrap'></div>"; //container for individual labels/controls
            var cwrapdiv = "<div id='bcrm_section_container' class='bcrm-new-grid-sc'></div>"; //container for new formsections
            var fs_sel = ".FormSection"; //selector for form sections, for easy replacement
            var field_sel = ".mceGridField"; //selector for grid layout controls/fields (not labels)
            var wrapcount = 0;
            var fieldlist = [];
            var iname = "";
            var lbltxt = "";
            //get free items (not below any formsection) first
            //fieldlist = appletconfig["free"]["fields"];
            for (var fx = 0; fx < fieldlist.length; fx++) {
                var fname = fieldlist[fx];
                for (c in cs) {
                    if (cs[c].GetFieldName() == fname) {
                        var cel = pm.GetRenderer().GetUIWrapper(cs[c]).GetEl();
                        if (typeof (cel) !== "undefined" && $(cel).parent(".siebui-applet-title").length == 0) {
                            iname = cs[c].GetInputName();
                            lblid = $(pm.GetRenderer().GetUIWrapper(cs[c]).GetEl()).attr("aria-labelledby");
                            lbltxt = $(pm.GetRenderer().GetUIWrapper(cs[c]).GetEl()).attr("aria-label");
                            break;
                        }
                    }
                }
                var thefield = ae.find("[name='" + iname + "']").parent(field_sel);
                var wrap = $(wrapdiv);
                wrap.attr("id", "wrap" + wrapcount);

                if (fld.length == 0) {
                    //var thefield = $(this).find(field_sel);
                    if (thefield.length > 0) {
                        //lblid = $(thefield.children()[0]).attr("aria-labelledby");
                        if (typeof (lblid) === "undefined") {
                            //dig deeper
                            thefield.children().each(function (z) {
                                if (typeof ($(this).attr("aria-labelledby")) !== "undefined") {
                                    lblid = $(this).attr("aria-labelledby");
                                }
                            });
                        }
                        //leave a mark
                        if (thefield.parent().find("span[id='bcrm_field']").length == 0) {
                            thefield.after("<span id='bcrm_field' data-iname='" + iname + "'></span>");
                        }
                        fld = thefield;
                        //fld = thefield.detach();
                        //fld.attr("data-iname", iname);
                        //fld.attr("data-btype", "bcrm_field");
                    }
                }

                //
                if (lbl.length == 0) {
                    if (lblid != "") {

                        //lbl = $(ae).find("[id='" + lblid + "']").parent()[0];
                        var lblelem = utils.GetLabelElem(cs[c], pm);
                        if (lblelem) {
                            lbl = lblelem.parent()[0];
                            if (typeof (lbl) === "undefined") { //work around misconfigured labels
                                lbl = $(ae).find("div.mceGridLabel:contains('" + lbltxt + "')")[0];
                            }
                            //leave a mark
                            if ($(lbl).parent().find("span[id='bcrm_label']").length == 0) {
                                $(lbl).after("<span id='bcrm_label' data-iname='" + iname + "'></span>");
                            }
                            lbl = $(lbl);
                            //lbl = $(lbl).detach();
                            //lbl.attr("data-iname", iname);
                            //lbl.attr("data-btype", "bcrm_label");
                        }
                    }
                }
                if (lbl.length == 1) {
                    lbl = $(lbl).detach();
                    lbl.attr("data-iname", iname);
                    lbl.attr("data-btype", "bcrm_label");
                    wrap.append(lbl);
                }
                if (fld.length == 1) {
                    fld = thefield.detach();
                    fld.attr("data-iname", iname);
                    fld.attr("data-btype", "bcrm_field");
                    wrap.append(fld);
                    $(newgriddiv).append(wrap);
                }

                lbl = [];
                fld = [];
                lblid = "";
                lbltxt = "";
                fname = "";
                thefield = null;
                iname = "";
                wrapcount++;
            }
            var hints;
            //get section items
            var cwrap = $(cwrapdiv);
            formsections = appletconfig;
            var seq = 0;
            for (f in formsections) {
                if (formsections[f]["seq"] >= 0) {
                    if (formsections[f]["seq"] > seq) {
                        seq = formsections[f]["seq"];
                    }
                }
            }
            seq++;
            for (var k = 0; k < seq; k++) {
                for (f in formsections) {
                    if (formsections[f]["seq"] == k) {
                        fieldlist = formsections[f]["fields"];
                        hints = formsections[f]["hints"];
                        var fsec = $("<h3 id='" + formsections[f]["id"] + "'>" + formsections[f]["caption"] + "</h3><div></div>");
                        for (fx = 0; fx < fieldlist.length; fx++) {
                            fname = fieldlist[fx];
                            for (c in cs) {
                                if (cs[c].GetFieldName() == fname) {
                                    cel = pm.GetRenderer().GetUIWrapper(cs[c]).GetEl();
                                    if (typeof (cel) !== "undefined" && $(cel).parent(".siebui-applet-title").length == 0) {
                                        iname = cs[c].GetInputName();
                                        lblid = $(pm.GetRenderer().GetUIWrapper(cs[c]).GetEl()).attr("aria-labelledby");
                                        lbltxt = $(pm.GetRenderer().GetUIWrapper(cs[c]).GetEl()).attr("aria-label");
                                        break;
                                    }
                                }
                            }
                            thefield = ae.find("[name='" + iname + "']").parent(field_sel);
                            wrap = $(wrapdiv);
                            wrap.attr("id", "wrap" + wrapcount);
                            wrapcount++;
                            if (fld.length == 0) {
                                //var thefield = $(this).find(field_sel);
                                if (thefield.length > 0) {
                                    //lblid = $(thefield.children()[0]).attr("aria-labelledby");
                                    if (typeof (lblid) === "undefined") {
                                        //dig deeper for a label id
                                        thefield.children().each(function (z) {
                                            if (typeof ($(this).attr("aria-labelledby")) !== "undefined") {
                                                lblid = $(this).attr("aria-labelledby");
                                            }
                                        });
                                    }
                                    //leave a mark
                                    if (thefield.parent().find("span[id='bcrm_field']").length == 0) {
                                        thefield.after("<span id='bcrm_field' data-iname='" + iname + "'></span>");
                                    }
                                    fld = thefield;
                                    //fld = thefield.detach();
                                    //fld.attr("data-iname", iname);
                                    //fld.attr("data-btype", "bcrm_field");
                                }
                            }
                            if (lbl.length == 0) {
                                if (lblid != "") {
                                    //debugger;
                                    //lbl = $(ae).find("[id='" + lblid + "']").parent()[0];
                                    var lblelem = utils.GetLabelElem(cs[c], pm);
                                    if (lblelem) {
                                        lbl = lblelem.parent()[0];
                                        if (typeof (lbl) === "undefined") { //work around misconfigured labels
                                            lbl = $(ae).find("div.mceGridLabel:contains('" + lbltxt + "')")[0];
                                        }
                                        //leave a mark
                                        if ($(lbl).parent().find("span[id='bcrm_label']").length == 0) {
                                            $(lbl).after("<span id='bcrm_label' data-iname='" + iname + "'></span>");
                                        }
                                        lbl = $(lbl);
                                        //lbl = $(lbl).detach();
                                        //lbl.attr("data-iname", iname);
                                        //lbl.attr("data-btype", "bcrm_label");
                                    }
                                }
                                //hints
                                if (typeof (hints) !== "undefined") {
                                    for (h = 0; h < hints.length; h++) {
                                        var hi = hints[h];
                                        var ht = "";
                                        if (typeof (hi[fname]) !== "undefined") {
                                            ht = hi[fname];
                                        }
                                        if (ht != "") {
                                            $(lbl).attr("data-hint", ht);
                                            $(lbl).attr("data-hintposition", "top-middle");
                                        }
                                    }
                                }
                            }
                            if (lbl.length == 1) {
                                lbl = $(lbl).detach();
                                lbl.attr("data-iname", iname);
                                lbl.attr("data-btype", "bcrm_label");
                                wrap.append(lbl);
                            }
                            if (fld.length == 1) {
                                fld = thefield.detach();
                                fld.attr("data-iname", iname);
                                fld.attr("data-btype", "bcrm_field");
                                wrap.append(fld);
                                $(fsec[1]).append(wrap);

                            }

                            lbl = [];
                            fld = [];
                            lblid = "";
                            fname = "";
                            thefield = null;
                            iname = "";


                        }
                    }
                    if ($(fsec).find(".bcrm-new-grid-wrap").length > 0) {
                        cwrap.append(fsec);
                    }
                }

            }
            $(newgriddiv).append(cwrap);
            $(newgriddiv).find("#bcrm_section_container").accordion(acconf);
            return $(newgriddiv);
        };
        BCRMRWDFactory.prototype.GetConfig = function (a) {
            //config examples
            var BCRMRWDConf = {
                "SIS Product Form Applet - ISS Admin__ISS Product Administration View": {
                    "free": { "seq": 0, "id": "free", "caption": "General", "fields": ["Type", "Name"] },//,"Organization","Orderable","Description","Version Status","Product Line","IsComplexProductBundle","Part #","Unit of Measure","IsComplexProductNotBundle","Payment Type","Product Def Type Code","Track As Asset Flag","Inventory Flag","Product Level","Maximum Quantity","Equivalent Product","Format","CDA Pageset","ThumbnImageFileName","Parent Internal Product Name","Start Date","Thumbnail Source Path","Network Element Type","End Date","ImageFileName","SPN Definition Name","Compound Flag","Image Source Path"]},
                    "HTML_FormSection2_Label": { "caption": "Marketing Info", "seq": 1, "id": "HTML_FormSection2_Label", "fields": ["Targeted Industry", "Targeted Min Age"] },//,"Targeted Postal Code","Targeted Country","Targeted Max Age"]},
                    "HTML_FormSection4_Label": { "caption": "Service", "seq": 4, "id": "HTML_FormSection4_Label", "fields": ["MTBF", "MTTR", "Field Replacable Unit", "Return if Defective", "Tool Flag", "Billing Type", "Billing Service Type"] },
                    "HTML_FormSection3_Label": { "caption": "Logistics", "seq": 2, "id": "HTML_FormSection3_Label", "fields": ["Vendor", "Vendor Location", "Vendor Part Number", "Item Size", "Lead Time", "Carrier", "Shipping Method", "Allocate Below Safety Flag", "Auto Substitute  Flag", "Auto Allocate Flag", "Auto Explode Flag"] },
                    "HTML_FormSection5_Label": { "caption": "Other", "seq": 3, "id": "HTML_FormSection5_Label", "fields": ["SAP Division Code", "Integration Id", "Global Product Identifier", "Serialized", "Configuration", "Taxable Flag", "Tax Subcomponent Flag", "Position Bill Product Flag", "Inclusive Eligibility Flag", "Compensatable"] }
                },
                "Service Request Detail Applet__Personal Service Request List View": {
                    "free": { "seq": 0, "id": "free", "caption": "General", "fields": [] },
                    "HTML_Label_2_Label": { "caption": "SR Information", "seq": 1, "id": "HTML_Label_2_Label", "fields": ["SR Number", "INS Product", "Contact Last Name", "Area", "Contact First Name", "Sub-Area", "Created", "Account Location", "Account", "CSN", "Commit Time", "Contact Account", "Closed Date", "Contact Business Phone", "Contact Email", "Source", "Reproduce"] },
                    "HTML_FormSection2_Label": { "caption": "Priority and Ownership", "seq": 2, "id": "HTML_FormSection2_Label", "fields": ["Status", "Sub-Status", "Priority", "Owner", "Created By", "Owner Group", "Organization", "Severity"] },
                    "SRSummaryForm_Label": { "caption": "Summary", "seq": 3, "id": "SRSummaryForm_Label", "fields": ["Abstract"] },
                    "DetailDescForm_Label": { "caption": "Detailed Description", "seq": 4, "id": "DetailDescForm_Label", "fields": ["Description", "Billable Flag"] },
                    "CustomerTimeFormSection_Label": { "caption": "Customer Time Zone", "seq": 5, "id": "CustomerTimeFormSection_Label", "fields": ["Contact Created", "Contact Commit Time", "Contact Closed Date"] },
                    "Social_Media_Section_Label": { "caption": "Social Media", "seq": 6, "id": "Social_Media_Section_Label", "fields": ["SM Author", "SM Community", "SM Sentiment", "SM Topic", "SM Influence Score", "SM Publish Date"] }
                },
                "Contact Form Applet__default": {
                    "free": { "seq": 0, "id": "free", "caption": "General", "fields": ["First Name", "Last Name", "M/M", "Job Title"] },
                    "section0": { "seq": 1, "id": "section0", "caption": "<span></span><i>" + "Contact Info" + "</i></span>", "fields": ["Email Address", "Work Phone #", "Cellular Phone #"] },
                    "section1": { "seq": 2, "id": "section1", "caption": "Company & Address", "fields": ["Account", "Account Location", "Personal Street Address", "Personal City", "Personal State", "Personal Postal Code", "Personal Country"] }
                },
                "Activity Form Applet__default": { "free": { "seq": 0, "id": "free", "caption": "General", "fields": ["Description", "Planned", "Type", "Duration Minutes", "Comment", "Planned Completion", "Done Flag", "Private", "Priority", "Primary Owned By", "Status", "Owned By", "Opportunity", "Contact Last Name", "Account Name", "Display"] } },
                "SIS Account Entry Applet__": {
                    "free": { "seq": 0, "id": "free", "caption": "General", "fields": ["Name", "Location", "City"] },
                    "section0": { "seq": 1, "id": "section0", "caption": "Account Details", "fields": ["Sales Rep", "Main Phone Number"] },
                    "section1": { "seq": 2, "id": "section1", "caption": "Address", "fields": ["Street Address", "State", "Postal Code", "Country"] }
                }
            };

            //formsection to accordion transform
            var utils = new SiebelAppFacade.BCRMUtils();
            var pm = utils.ValidateContext(a);
            var ae = utils.GetAppletElem(pm);
            var cs = pm.Get("GetControls");
            var formsections = {};
            var colpos = 0;
            var rowpos = 0;
            var seq = 1;
            var an = pm.GetObjName();

            var vn = SiebelApp.S_App.GetActiveView().GetName();
            var cname = an + "__" + vn;
            var dname = an + "__default";
            var tname = an + "__";
            var useconf = "none";
            var appletconfig = BCRMRWDConf[cname];
            var hasconfig = false;
            if (typeof (appletconfig) === "undefined") {
                appletconfig = BCRMRWDConf[tname];
            }
            else {
                useconf = cname;
            }
            if (typeof (appletconfig) === "undefined") {
                appletconfig = BCRMRWDConf[dname];
            }
            else {
                useconf = tname;
            }
            if (typeof (appletconfig) !== "undefined") {
                hasconfig = true;
                if (useconf == "none") {
                    useconf = dname;
                }
            }

            //console.log("BCRMRWDFactory.GetConfig: " + an + " : " + useconf);
            var fs_sel = ".FormSection"; //selector for form sections, for easy replacement
            var field_sel = ".mceGridField"; //selector for grid layout controls/fields (not labels)
            var tb = ae.find("table.GridBack");
            //first pass: markup TR and TD elements and collect formsection info
            tb.find("tr").each(function (i) {
                $(this).attr("data-rowpos", rowpos);
                $(this).find("td").each(function (j) {
                    //set attributes for each TD
                    $(this).attr("data-colpos", colpos);
                    $(this).attr("data-top", $(this).offset().top);
                    $(this).attr("data-left", $(this).offset().left);
                    $(this).attr("data-width", $(this).width());
                    if (j > 0) { colpos++; }

                    if ($(this).find(fs_sel).length > 0) {
                        //if TD hosts a formsection, collect its info into a temp object
                        var td = $(this);
                        var fs = td.find(fs_sel).parent();
                        var fslbl = td.find("span").attr("id");//td.find(fs_sel).text();
                        var colspan = parseInt(td.attr("colspan"));
                        formsections[fslbl] = {};
                        formsections[fslbl]["caption"] = td.find(fs_sel).text();
                        //formsections[fslbl]["color"] = "#" + (j+1).toString() + (j+2).toString() + (j+3).toString();
                        formsections[fslbl]["seq"] = seq;
                        formsections[fslbl]["id"] = td.find("span").attr("id");
                        formsections[fslbl]["fields"] = [];
                        seq++;
                        colpos += colspan;
                        //debugger;
                    }
                });
                colpos = 0;
                rowpos++;
                //add "free" formsection
                formsections["free"] = { "seq": 0, "id": "free", "caption": "General", "fields": [] };
            });

            if (seq == 1) {
                //applet repo definition has no formsections, but custom config could have
                if (hasconfig) {
                    for (acf in appletconfig) {
                        if (acf != "free") {
                            seq++;
                        }
                    }
                }
            }
            //2nd pass
            //for each td with an input, "look up" (literally) to which formsection it belongs to
            tb.find("td").each(function (i) {
                var td = $(this);
                if (td.find(fs_sel).length == 0 && td.find(field_sel).length == 1) {  //only include inputs
                    var r = parseInt(td.parent("tr").attr("data-rowpos"));
                    var cushion = 5;
                    var left = parseInt(td.attr("data-left")) + cushion;
                    var fid = "";
                    for (var ri = r; ri >= 0; ri--) {
                        //go upward until we find the formsection
                        var tr = tb.find("tr[data-rowpos='" + ri + "']");
                        tr.find("td").each(function (j) {
                            var tdi = $(this);
                            if (tdi.find(fs_sel).length == 1 && fid == "") {
                                var fstart = parseInt(tdi.attr("data-left"));
                                var fend = fstart + parseInt(tdi.attr("data-width"));
                                if (fstart <= left && left <= fend) { //if left (plus cushion) side of control is within the formsection's boundaries
                                    fid = tdi.find("span").attr("id"); //get the formsection id
                                    //break;
                                }
                            }
                        });
                    }
                    if (fid != "") {  //mark each control TD with the formsection id it appears under
                        if (typeof (td.attr("data-fid")) === "undefined") {
                            td.attr("data-fid", fid);
                            //colorize for debugging
                            /*
                             for (f in formsections){
                             if (fid == formsections[f]["id"]){
                             td.css("background",formsections[f].color);
                             }
                             }
                             */
                        }

                    }
                    else {   //control could be "free" , ie not under any formsection
                        fid = "free";
                        td.attr("data-fid", fid);
                    }

                    if (!hasconfig) { //write field list to formsection
                        var inputname = $(td.find(field_sel).children()[0]).attr("name");
                        if (typeof (inputname) !== "undefined") {

                            for (c in cs) {
                                if (cs[c].GetInputName() == inputname) {
                                    formsections[fid]["fields"].push(cs[c].GetFieldName());
                                }
                            }
                        }

                    }
                    fid = "";
                }
            });

            //use current layout as config if no custom config is present
            if (!hasconfig) {
                appletconfig = formsections;
            }
            return appletconfig;
        };
        return BCRMRWDFactory;
    }());
}

//Experimental/sunsetted: show unmapped fields for an applet
//uses jquery plugin "multiselect" (see WSHelper)
//but /workspace REST API doesn't play well when creating controls
//leaving this here to document the multiselect plugin
/*
BCRMShowUnmappedFields = function (context) {
    var ut = new SiebelAppFacade.BCRMUtils();
    var pm = ut.ValidateContext(context);
    var mapped = [];
    var unmapped = {};
    if (pm) {
        var an = pm.GetObjName();
        var bc = pm.Get("GetBusComp").GetName();
        var bcd = ut.GetBCData(bc);
        var cs = pm.Get("GetControls");
        var fields = bcd["Fields"];
        for (c in cs) {
            if (cs[c].GetFieldName() != "") {
                mapped.push(cs[c].GetFieldName());
            }
        }
        for (f in fields) {
            if (mapped.indexOf(f) == -1) {
                unmapped[f] = {};
                unmapped[f]["Type"] = fields[f]["Type"];
                unmapped[f]["Text Length"] = fields[f]["Text Length"];
            }
        }
    }
    var ct = $("<div id='bcrm_ms_container'><div class='row' style='display:flex'></div></div>");
    var c1 = $("<div class='col-sm-5'>Available/Unmapped</div>");
    var ms = $("<select style='height:500px;width:280px' id='multiselect' class='form-control' size='8' multiple='multiple' name='from[]'>");
    for (u in unmapped) {
        var opt = $("<option value='" + u + "'>" + u + "</option>");
        ms.append(opt);
    }
    c1.append(ms);
    var c2 = $("<div class='col-sm-2' style='display:grid;height:fit-content;margin:10px;'></div>");
    c2.append('<button type="button" style="font-size:1.2em;margin:4px;" id="multiselect_rightAll" class="btn btn-block">&gt;&gt</button>');
    c2.append('<button type="button" style="font-size:1.2em;margin:4px;" id="multiselect_rightSelected" class="btn btn-block">&gt;</button>');
    c2.append('<button type="button" style="font-size:1.2em;margin:4px;" id="multiselect_leftSelected" class="btn btn-block">&lt;</button>');
    c2.append('<button type="button" style="font-size:1.2em;margin:4px;" id="multiselect_leftAll" class="btn btn-block">&lt;&lt;</button>');

    var c3 = $("<div class='col-sm-5'>Selected</div>");
    c3.append('<select name="to[]" style="height:500px;width:280px" id="multiselect_to" class="form-control" size="8" multiple="multiple"></select>');
    c3.append('<div class="row" style="display:flex;margin-top:4px;"><div style="margin:auto;" class="col-sm-6"><button type="button" id="multiselect_move_up" class="btn btn-block">Move Up</button></div><div style="margin:auto;" class="col-sm-6"><button type="button" id="multiselect_move_down" class="btn btn-block col-sm-6">Move Down</button></div></div>');
    ct.find(".row").append(c1);
    ct.find(".row").append(c2);
    ct.find(".row").append(c3);
    
    ct.dialog({
        title: "Add Fields to " + an,
        width:650,
        height:650,
        buttons:{
            Apply: function () {
                var resp = SiebelApp.Utils.Confirm("Controls will be added to the applet in the current workspace.\nYou must use Siebel Web Tools to complete the layout.\nContinue?");
                if (resp){
                    //ISSUE: REST API PUT/POST not working for Controls (Field and Caption not inserted)
                    $(this).dialog("destroy");
                }
                else{
                    //do nothing
                }
            },
            Cancel: function (e, ui) {
                $(this).dialog("destroy");
            }
        }
    })

    setTimeout(function(){
        $("#multiselect").multiselect({
            search: {
                left: '<input type="text" name="q" style="width:270px;font-size:1.2em;margin-bottom:4px;" placeholder="Search..." />'
            },
            fireSearch: function(value) {
                return value.length > 0;
            }
        });
    },100);
}
*/

//get server and component status through undocumented SMC REST API
//do not try this at home!
var BCRM_BASIC_AUTH = "";
var BCRM_ENT = "";
var BCRM_SERVERS = [];
var BCRM_COMPS = [];

BCRMGetCredentials = function (next) {
    var dlg = $("<div id='bcrm_cred_dlg' style='display:grid;'>");
    var user = $("<input id='username' type='text' placeholder='User Name'>");
    var pw = $("<input id='password' type='password' placeholder='Password'>");
    dlg.append(user);
    dlg.append(pw);
    dlg.dialog({
        title: "Provide Credentials for Server Management",
        width: 540,
        height: 200,
        buttons: {
            Go: function (e, ui) {
                var un = $(this).find("#username").val();
                var pw = $(this).find("#password").val();
                BCRM_BASIC_AUTH = "Basic " + btoa(un + ":" + pw);
                $(this).dialog("destroy");
                if (next == "ent") {
                    BCRMGetEnterprise();
                }
                if (next == "srv") {
                    BCRMGetServers();
                }
                if (next == "com") {
                    BCRMGetComponents();
                }
                if (next == "dis") {
                    BCRMDisplayServer();
                }
            },
            Cancel: function (e, ui) {
                $(this).dialog("destroy");
            }
        }
    });
};

BCRMGetEnterprise = function () {
    var retval;
    if (BCRM_BASIC_AUTH == "") {
        BCRMGetCredentials("ent");
    }
    else {
        var data = $.ajax({
            dataType: "json",
            url: location.origin + "/siebel/v1.0/cloudgateway/enterprises/",
            async: false,
            method: "GET",
            "headers": {
                "Authorization": BCRM_BASIC_AUTH
            }
        });
        if (data.status == 200) {
            retval = data.responseJSON.Result[0].EP_NAME;
            BCRM_ENT = retval;
        }
        else {
            retval = data.status + ":" + data.responseText;
        }
    }
    return retval;
};

BCRMGetServers = function () {
    var retval;
    if (BCRM_BASIC_AUTH == "") {
        BCRMGetCredentials("srv");
    }
    else {
        if (BCRM_ENT == "") {
            BCRMGetEnterprise();
            BCRMGetServers();
        }
        else {
            var data = $.ajax({
                dataType: "json",
                url: location.origin + "/siebel/v1.0/cloudgateway/enterprises/" + BCRM_ENT + "/servers",
                async: false,
                method: "GET",
                "headers": {
                    "Authorization": BCRM_BASIC_AUTH
                }
            });
            if (data.status == 200) {
                retval = data.responseJSON.Result;
                BCRM_SERVERS = retval;
            }
            else {
                retval = data.status + ":" + data.responseText;
            }
        }
    }
    return retval;
};

BCRMGetComponents = function () {
    var retval;
    if (BCRM_BASIC_AUTH == "") {
        BCRMGetCredentials("com");
    }
    else {
        if (BCRM_ENT == "") {
            BCRMGetEnterprise();
            BCRMGetComponents();
        }
        else {
            var data = $.ajax({
                dataType: "json",
                url: location.origin + "/siebel/v1.0/cloudgateway/enterprises/" + BCRM_ENT + "/components",
                async: false,
                method: "GET",
                "headers": {
                    "Authorization": BCRM_BASIC_AUTH
                }
            });
            if (data.status == 200) {
                retval = data.responseJSON.Result;
                BCRM_COMPS = retval;
            }
            else {
                retval = data.status + ":" + data.responseText;
            }
        }
    }
    return retval;
};

BCRMDisplayServer = function () {
    if (BCRM_BASIC_AUTH == "") {
        BCRMGetCredentials("dis");
    }
    else {
        if (BCRM_SERVERS.length == 0) {
            BCRMGetServers();
        }
        if (BCRM_COMPS.length == 0) {
            BCRMGetComponents();
        }
        if (BCRM_COMPS.length >= 1 && BCRM_SERVERS.length >= 1) {
            var dlg = $("<div id='bcrm_srv_dlg' style='overflow:auto;'>");
            for (var i = 0; i < BCRM_SERVERS.length; i++) {
                var state = BCRM_SERVERS[i].SV_DISP_STATE;
                var svname = BCRM_SERVERS[i].SBLSRVR_NAME;
                var start = BCRM_SERVERS[i].START_TIME;
                var sv = $("<div id='srv_" + svname + "'>" + svname + ": " + state + "</div>");
                sv.css("font-size", "1.4em");
                switch (state) {
                    case "Running": sv.css("background", "darkseagreen"); break;
                    default: sv.css("background", "coral"); break;
                }
                dlg.append(sv);
                if (state == "Running") {
                    for (var j = 0; j < BCRM_COMPS.length; j++) {
                        if (BCRM_COMPS[j].SV_NAME == svname) {
                            var cstate = BCRM_COMPS[j].CP_DISP_RUN_STATE;
                            var tasks = BCRM_COMPS[j].CP_NUM_RUN_TASKS;
                            var cname = BCRM_COMPS[j].CC_NAME;
                            var max = BCRM_COMPS[j].CP_MAX_TASKS;
                            var cm = $("<div id='cm_" + cname + "'>" + cname + ": " + cstate + " (" + tasks + " of " + max + " tasks)</div>");
                            cm.css("margin-left", "6px");
                            switch (cstate) {
                                case "Running":
                                case "Online": cm.css("font-weight", "bold"); break;
                            }
                            sv.after(cm);
                        }
                        dlg.find(sv).after(cm);
                    }
                }
            }
            dlg.dialog({
                title: "Server Component Status",
                width: 800,
                height: 600
            });
            //force reload
            setTimeout(function () {
                BCRM_SERVERS = [];
                BCRM_COMPS = [];
            }, 20000);
        }
    }
}

//Business Service meep meep
//Run Business Services faster than ever
BCRMGetIOList = function () {
    var sv = SiebelApp.S_App.GetService("FWK Runtime");
    var ip = SiebelApp.S_App.NewPropertySet();
    var op = sv.InvokeMethod("GetIOList", ip).GetChildByType("ResultSet");
    var r = [];
    for (p in op.propArray) {
        r.push(op.propArray[p]);
    }
    return r;
};


BCRMGetWFList = function () {
    var sv = SiebelApp.S_App.GetService("FWK Runtime");
    var ip = SiebelApp.S_App.NewPropertySet();
    var op = sv.InvokeMethod("getWFList", ip).GetChildByType("ResultSet");
    var r = [];
    for (p in op.propArray) {
        if (p != "CleanEmptyElements") {
            r.push(p);
        }
    }
    r.sort();
    return r;
};

BCRMGetBSMethod = function (sn) {
    var ut = new SiebelAppFacade.BCRMUtils();
    var bsd = ut.GetBSData(sn);
    var ms = bsd["Business Service Method"];
    return ms;
};

BCRMMeepReset = function (preset) {
    $("#bcrm_service").val("");
    $("#bcrm_method").val("");
    $("#bcrm_method").parent().hide();
    $("#bcrm_outt").val("");
    $("#bcrm_outt").hide();
    $("#bcrm_outps").val("");
    $("#bcrm_outps").hide();
    $("#bcrm_add_prop").hide();
    $("input[id^='bcrm_ip']").each(function (x) {
        $(this).parent().remove();
    });
    $("input.bcrm-cp-val").each(function (x) {
        $(this).parent().remove();
    });
    if (!preset) {
        $("#bcrm_preset").val("void");
    }
};

var last_meep = "";
BCRMInvokeServiceMethod = function (p, print) {
    var retval;
    var sExpr = "var svc = TheApplication().GetService(\"" + p.service + "\");\n";
    sExpr += "var ips = TheApplication().NewPropertySet();\n";
    sExpr += "var ops = TheApplication().NewPropertySet();\n";
    sExpr += "var bsWFUtils = TheApplication().GetService(\"Workflow Utilities\");\n";
    sExpr += "var psIn = TheApplication().NewPropertySet();\n";
    sExpr += "var psOut = TheApplication().NewPropertySet();\n";
    sExpr += "var retval;\n";

    for (prop in p.inputs) {
        if (p.inputs[prop].indexOf("@") == 0) {
            sExpr += "psIn.SetValue(\"" + p.inputs[prop] + "\");\n"
            sExpr += "bsWFUtils.InvokeMethod(\"TextToPropSet\", psIn, psOut);\n";
            sExpr += "ips.AddChild(psOut.Copy());\n";
            sExpr += "psIn.Reset();\n";
            sExpr += "psOut.Reset();\n";
        }
        else if (prop == "<Value>") {
            sExpr += "ips.SetValue('" + p.inputs[prop] + "');\n";
        }
        else if (prop == "<Type>") {
            sExpr += "ips.SetType(\"" + p.inputs[prop] + "\");\n";
        }
        else {
            sExpr += "ips.SetProperty(\"" + prop + "\",\"" + p.inputs[prop] + "\");\n";
        }
    }

    sExpr += "svc.InvokeMethod(\"" + p.method + "\",ips,ops);\n";
    sExpr += "psIn = ops.Copy();\n";
    sExpr += "bsWFUtils.InvokeMethod(\"PropSetToText\", psIn, psOut);\n";
    sExpr += "retval = psOut.GetValue();\n";
    sExpr += "log(ops);\n";
    sExpr += "svc = null;\n";
    sExpr += "ips = null;\n";
    sExpr += "ops = null;\n";
    sExpr += "bsWFUtils = null;\n";
    sExpr += "psIn = null;\n";
    sExpr += "psOut = null;\n";
    sExpr += "return retval;";
    var service = SiebelApp.S_App.GetService("FWK Runtime");
    var ps = SiebelApp.S_App.NewPropertySet();
    ps.SetProperty("Expr", sExpr);
    var outputSet = service.InvokeMethod("EvalScript", ps);
    last_meep = outputSet.GetChildByType("ResultSet").GetProperty("v");
    if (print) {
        retval = sExpr;
    }
    else {
        retval = outputSet;
    }
    return retval;
};

BCRMCreatePreset = function () {
    var preset = {};
    var sn = "";
    var mn = "";
    var i = {};
    var prop;
    var t = $("#bcrm_service").val();
    if (t.indexOf("-[") > -1) {
        sn = t.split("-[")[1]
        sn = sn.substring(0, sn.length - 1);
    }
    else {
        sn = t;
    }
    mn = $("#bcrm_method").val();
    $("input[id^='bcrm_ip']").each(function (x) {
        if ($(this).val() != "") {
            prop = $(this).attr("id").split("_")[2];
            i[prop] = $(this).val();
        }
    });
    preset.service = sn;
    preset.method = mn;
    preset.inputs = i;
    return preset;
};

BCRMCreateWFPreset = function () {
    var p = {
        "service": "Workflow Process Manager",
        "method": "RunProcess",
        "inputs": {
            "ProcessName": "<Select Workflow Process>",
            "RowId": SiebelApp.S_App.GetActiveView().GetActiveApplet().GetBusComp().GetFieldValue("Id")
        }
    };
    localStorage.setItem("BCRM_MEEP_Run Workflow", JSON.stringify(p));
}

BCRMGetWFProps = function (wn) {
    //get DR first, if not found get RR
    var retval;
    var sv = SiebelApp.S_App.GetService("FWK Runtime");
    var ips = SiebelApp.S_App.NewPropertySet();
    ips.SetProperty("Process Name", wn);
    var drprops = sv.InvokeMethod("getDRWFProps", ips).GetChildByType("ResultSet");
    var drcount = 0;
    drcount = drprops.GetChildCount();
    if (drcount > 0) {
        retval = drprops;
    }
    else {
        //not found in DR, we are likely running in RR, so we must dance
        try {
            var ut = new SiebelAppFacade.BCRMUtils();
            var wd, ops;
            wd = ut.GetRRData("Workflow", wn);
            //Workflow data is base64 encoded XML
            var b64xml = wd.GetChild(0).GetChild(0).GetProperty("Workflow Mode");
            var xml = atob(b64xml);
            var props = xml.split("<ListOfRepositoryWfProcessProp\n>")[1];
            props = props.split("</ListOfRepositoryWfProcessProp\n>")[0];
            props = '<?xml version="1.0" encoding="UTF-16"?>' + "<ListOfRepositoryWfProcessProp\n>" + props + "</ListOfRepositoryWfProcessProp\n>";
            props = props.replaceAll("\n", "");
            var preset = {
                "service": "XML Converter",
                "method": "XMLToPropSet",
                "inputs": { "<Value>": props }
            };
            var r = BCRMInvokeServiceMethod(preset);
            var opst = r.GetChildByType("ResultSet").GetProperty("v");
            ops = SiebelApp.S_App.NewPropertySet();
            ops.DecodeFromString(opst);
            var outputs = SiebelApp.S_App.NewPropertySet();
            var cps;
            var pn, cm, dt, defs, inout, inact;
            var dtmap = { "VARCHAR": "String", "NUMBER": "Number" };
            var ign = ["Error Code", "Object Id", "Siebel Operation Object Id", "Error Message", "Process Instance Id", "CleanEmptyElements"];
            if (typeof (ops) !== "undefined") {
                for (p in ops.childArray) {
                    if (typeof (ops.childArray[p].childArray) !== "undefined") {
                        pn = ops.childArray[p].childArray[12].value;
                        inout = ops.childArray[p].childArray[9].value;
                        inact = ops.childArray[p].childArray[10].value;
                        if (ign.indexOf(pn) == -1 && inout.indexOf("IN") == 0 && inact != "Y") {
                            cps = SiebelApp.S_App.NewPropertySet();
                            cm = ops.childArray[p].childArray[2].value;
                            dt = ops.childArray[p].childArray[4].value;
                            defs = ops.childArray[p].childArray[7].value;
                            cps.SetProperty("InOut", inout == "INOUT" ? "In/Out" : "In");
                            cps.SetProperty("Inactive", inact);
                            cps.SetProperty("Comments", cm);
                            cps.SetProperty("Data Type", dtmap[dt]);
                            cps.SetProperty("Default String", defs);
                            cps.SetProperty("Name", pn);
                            outputs.AddChild(cps);
                        }
                    }
                }
                retval = outputs;
            }
        }
        catch (e) {
            alert("Could not find definition of '" + wn + "' in Runtime Repository.");
        }
    }
    return retval;
};

//Enhance for Workflows
BCRMWorkflowRunner = function () {
    //only if 20.7 or later
    if (BCRMSiebelVersionCheck(20, 7, "ge")) {
        var brf = $('<button style="margin-left:16px;" title="Reload Row Id from active record" id="bcrm_del_preset">Reload</button>');
        brf.on("click", function () {
            $("input#bcrm_ip_RowId").val(SiebelApp.S_App.GetActiveView().GetActiveApplet().GetBusComp().GetFieldValue("Id"));
        });
        var inpc = $("input#bcrm_ip_ProcessName");
        $("input#bcrm_ip_RowId").parent().find("label").after(brf);
        var temp = $("input#bcrm_ip_RowId").parent().detach();
        inpc.parent().after(temp);
        inpc.parent().css("background", "lightblue");
        inpc.parent().css("font-weight", "bold");
        inpc.autocomplete({
            source: BCRMGetWFList(),
            minLength: 0,
            open: function () {
                $(this).autocomplete('widget').css("z-index", "10000");
            },
            select: function (e, ui) {
                //cleanup
                $(".bcrm-process-prop").remove();
                var pn, dt, defs, cm;
                var wn = ui.item.value;
                var ign = ["Error Code", "Object Id", "Siebel Operation Object Id", "Error Message", "Process Instance Id", "CleanEmptyElements"];
                var props = BCRMGetWFProps(wn);
                if (typeof (props) !== "undefined") {
                    for (p in props.childArray) {
                        if (p != "CleanEmptyElements") {
                            pn = props.childArray[p].GetProperty("Name");
                            if (ign.indexOf(pn) == -1) {
                                cm = props.childArray[p].GetProperty("Comments");
                                dt = props.childArray[p].GetProperty("Data Type");
                                defs = props.childArray[p].GetProperty("Default String");
                                var tip = $('<div class="bcrm-process-prop" style="padding:2px;background:whitesmoke;"><div style="width: 200px;float:left;"><label for="bcrm_ip">' + pn + ':</label></div><input id="' + 'bcrm_ip_' + pn + '" style="width:300px;"></div>');
                                tip.find("input").attr("placeholder", "Property:" + dt);
                                if (cm != "") {
                                    tip.find("input").attr("title", cm);
                                }
                                if (dt == "String" && defs != "") {
                                    tip.find("input").val(defs);
                                }
                                $("#bcrm_ip_RowId").parent().after(tip);
                            }
                        }
                    }
                }
            }
        });
        inpc.focus(function () {
            $(this).autocomplete('search', $(this).val());
        });
        inpc.click(function () {
            $(this).autocomplete('search', "");
        });
    }
    else {
        console.log("devpops Workflow Runner is not supported in " + BCRM_SIEBEL_V.y + "." + BCRM_SIEBEL_V.m + ". Requires 20.7 or later");
    }
};

BCRMTitle = function (el, text) {
    //el.text(text);
};

//main dialog
BCRMBusinessServiceRunner = function () {
    BCRMCreateWFPreset();
    var ut = new SiebelAppFacade.BCRMUtils();
    var bs = ut.GetBusinessServiceList();
    var ms;
    var sn;
    var dlg = $('<div style="overflow:auto;"><div style="width: 200px;float:left;"><label for="bcrm_service">Business Service (Type to search):</label></div><input style="width:300px;" id="bcrm_service"></div>');
    var pre = $('<div style="display:none;padding-bottom: 4px;border-bottom: 1px solid;margin-bottom: 4px;"><div style="width: 200px;float:left;"><label for="bcrm_presets">Load Preset:</label></div><select  style="width:300px;" id="bcrm_preset"></select><button style="margin-left:16px;" title="Delete current preset" id="bcrm_del_preset">Delete</button></div>');
    var mt = $('<div style="display:none;margin-top:6px;margin-bottom:6px;"><div style="width: 200px;float:left;"><label for="bcrm_method">Method:</label></div><input  style="width:300px;" id="bcrm_method"></div>');
    var outt = $("<textarea style='display:none;width:750px;height:300px;overflow:auto;margin-top:10px;' id='bcrm_outt'></textarea>");
    var outps = $("<textarea style='display:none;width:750px;height:80px;overflow:auto;margin-top:10px;' id='bcrm_outps'></textarea>");
    var addp = $("<button style='display:none;margin-top:6px;' id='bcrm_add_prop'>Add Custom Property</button>");
    addp.on("click", function () {
        var tip = $('<div style="padding:2px;background:whitesmoke;"><div style="width: 200px;float:left;"><label for="bcrm_ip">CLICK_ME</label></div><input class="bcrm-cp-val" style="width:300px;"><select></select></div>');
        tip.find("label").on("click", function () {
            var ltext = $("<input id='bcrm_newlabel' placeholder='Property Name'>");
            ltext.on("blur", function () {
                if ($(this).val() != "") {
                    var lbl = $(this).parent().find("label");
                    var int = lbl.parent().parent().find("input.bcrm-cp-val");
                    lbl.text($(this).val() + ":");
                    int.attr("id", "bcrm_ip_" + $(this).val());
                    int.attr("placeholder", "Property:String");
                }
                else {
                    $(this).parent().find("label").text("CLICK_ME");
                }
                $(this).parent().find("label").show();
                $(this).hide();
            });
            $(this).after(ltext);
            $(this).hide();
            ltext.focus();
        });
        var sl = tip.find("select");
        sl.append("<option val='Property:String' selected='selected'>Property:String</option>");
        sl.append("<option val='Property:Number'>Property:Number</option>");
        sl.append("<option val='Value:String'>Value:String</option>");
        sl.append("<option val='Type:String'>Type:String</option>");
        sl.append("<option val='Child PropSet'>Child PropSet</option>");
        sl.on("change", function () {
            var lbl = $(this).parent().find("label");
            var int = $(this).parent().find("input.bcrm-cp-val");
            int.attr("placeholder", $(this).val());
            if ($(this).val().indexOf("Value") == 0) {
                lbl.text("<Value>");
                int.attr("id", "bcrm_ip_<Value>");
            }
            if ($(this).val().indexOf("Type") == 0) {
                lbl.text("<Type>");
                int.attr("id", "bcrm_ip_<Type>");
            }
        });
        $("input[id^='bcrm_ip']").last().parent().after(tip);
    });
    var preset_found = false;
    var pss;
    dlg.prepend(pre);
    dlg.append(mt);
    dlg.append(addp);
    dlg.append(outt);
    dlg.append(outps);
    for (l in localStorage) {
        if (l.indexOf("BCRM_MEEP") == 0) {
            preset_found = true;
            pss = dlg.find("#bcrm_preset");
            pss.append("<option value='" + l.split("BCRM_MEEP_")[1] + "'>" + l.split("BCRM_MEEP_")[1] + "</option>");
        }
    }
    if (preset_found) {
        pss = dlg.find("#bcrm_preset");
        pss.prepend("<option value='void' selected='selected'>" + "Please select..." + "</option>");
        pss.on("change", function () {
            if ($(this).val() != "void") {
                BCRMMeepReset(true);
                var ln = "BCRM_MEEP_" + $(this).val();
                var p = JSON.parse(localStorage.getItem(ln));
                $("#bcrm_service").val(p.service);
                $("#bcrm_method").parent().show();
                $("#bcrm_method").val(p.method);
                $("#bcrm_add_prop").show();
                var args = p.inputs;
                for (a in args) {
                    var tip = $('<div style="padding:2px;background:whitesmoke;"><div style="width: 200px;float:left;"><label for="bcrm_ip">:</label></div><input style="width:300px;"></div>');
                    tip.find("input").attr("id", "bcrm_ip_" + a);
                    tip.find("label").text(a + ":");
                    tip.find("input").val(args[a]);
                    $("#bcrm_method").parent().after(tip);
                }
            }
            if ($(this).val() == "Run Workflow") {
                BCRMWorkflowRunner();
            }
        });
        var delbtn = pss.parent().find("button");
        delbtn.on("click", function () {
            var pss = $(this).parent().find("#bcrm_preset");
            if (pss.val() != "void") {
                var v = pss.val();
                var ln = "BCRM_MEEP_" + v;
                localStorage.removeItem(ln);
                pss.val("void");
                pss.find("option[value='" + v + "']").remove();
            }
        });
        dlg.find("#bcrm_preset").parent().show();
    }
    dlg.dialog({
        width: 800,
        height: 700,
        buttons: {
            "New": function () {
                BCRMMeepReset();
            },
            "Use Last Output": function () {
                var lastps = SiebelApp.S_App.NewPropertySet();
                var pval = "";
                var ta;
                var decoded = false;
                decoded = lastps.DecodeFromString(last_meep);
                if (!decoded) {
                    //could be type 4 (base64 encoded value)
                    ta = last_meep.split("*");
                    lastps.SetValue(atob(ta.pop()));
                }
                $("input[id^='bcrm_ip']").each(function (x) {
                    var prop = $(this).attr("id").split("_")[2];
                    var dt = $(this).attr("placeholder");
                    if (dt.indexOf("Property") == 0) {
                        if (typeof (lastps.GetProperty(prop)) !== "undefined") {
                            pval = lastps.GetProperty(prop);
                            if (pval != "") {
                                $(this).val(pval);
                            }
                        }
                    }
                    if (dt.indexOf("Child") == 0) {
                        if (lastps.GetChildByType(prop) != null) {
                            var cps = lastps.GetChildByType(prop);
                            cps = cps.EncodeAsStringOld();
                            $(this).val(cps);
                        }
                    }
                    if (dt.indexOf("Value") == 0) {
                        $(this).val(lastps.GetValue());
                    }
                    if (dt.indexOf("Type") == 0) {
                        $(this).val(lastps.GetType());
                    }
                });
            },
            "Run": function () {
                var title = $(this).parent().find(".ui-dialog-title");
                var tt = title.text();
                var ts, elps;
                var preset = BCRMCreatePreset();
                ts = Date.now();
                var outputSet = BCRMInvokeServiceMethod(preset);
                elps = Date.now() - ts;
                $("#bcrm_outt").show();
                $("#bcrm_outt").val("Time elapsed (ms):" + elps.toString() + "\n" + outputSet.GetChildByType("ResultSet").GetProperty("Result"));
                $("#bcrm_outps").show();
                $("#bcrm_outps").val(outputSet.GetChildByType("ResultSet").GetProperty("v"));
                $("#bcrm_outps")[0].scrollIntoView();
                setTimeout(function () {
                    BCRMTitle(title, tt);
                }, 200);
            },
            "Save As": function () {
                var preset = {};
                var sv = $("#bcrm_service").val();
                var m = $("#bcrm_method").val();
                var f = "";
                var i = {};

                $("input[id^='bcrm_ip']").each(function (x) {
                    if ($(this).val() != "") {
                        var prop = $(this).attr("id").split("_")[2];
                        i[prop] = $(this).val();
                        if (f == "") {
                            f = prop.substring(0, 3) + "_" + $(this).val().substring(0, 3);
                        }
                    }
                });
                preset.service = sv;
                preset.method = m;
                preset.inputs = i;
                var r = true;
                var pdef = sv + "_" + m + "_" + f;

                if (sv == "Workflow Process Manager") {
                    pdef = "WF_" + $("#bcrm_ip_ProcessName").val();
                }
                pdef += "_" + Math.floor(Math.random() * 9999).toString();
                var pname = SiebelApp.Utils.Prompt("Save Preset as...", pdef);
                var ln = "BCRM_MEEP_" + pname;
                if (localStorage.getItem(ln) != null) {
                    r = SiebelApp.Utils.Confirm("Preset already exists.\nPress OK to replace.\nPress Cancel to abort.");
                }
                if (r && localStorage.getItem(ln) == null) {
                    localStorage.setItem(ln, JSON.stringify(preset));
                    pss = $("#bcrm_preset");
                    pss.append("<option value='" + pname + "'>" + pname + "</option>");
                }
                if (r && localStorage.getItem(ln) != null) {
                    localStorage.setItem(ln, JSON.stringify(preset));
                }
            },
            "Copy PropSet": function () {
                var tempta = $("<textarea id='bcrm_temp_ta'>");
                tempta.val($("#bcrm_outps").val());
                tempta.appendTo("body");
                tempta.focus();
                tempta[0].select();
                document.execCommand('copy');
                tempta.remove();
            },
            "Export eScript": function () {
                var preset = BCRMCreatePreset();
                var es = BCRMInvokeServiceMethod(preset, true);
                var tempta = $("<textarea style='width:92%;margin-left:10px;overflow:auto;' id='bcrm_temp_ta'>");
                tempta.val(es);
                tempta.appendTo("body");
                tempta.focus();
                tempta[0].select();
                document.execCommand('copy');
                tempta.dialog({
                    title: "eScript copied to clipboard",
                    buttons: {
                        "Close": function () {
                            $(this).dialog("destroy");
                            $("#bcrm_temp_ta").remove();
                        }
                    },
                    width: 900,
                    height: 500,
                    open: function () {
                        $("#bcrm_temp_ta").css("width", "92%");
                    }
                });
            },
            "Close": function () {
                $(this).dialog("destroy");
            }
        },
        title: "Business Service Runner (meep meep)",
        open: function () {
            $(this).parent().find(".ui-dialog-buttonset").find("button").each(function (x) {
                if ($(this).text() == "Run") {
                    $(this).css({ "cursor": "pointer", "font-size": "4em", "position": "relative", "bottom": "600px", "left": "420px", "float": "left", "background": "#385427", "color": "white", "border-radius": "10px" });
                    //$(this).draggable();
                    $(this).on("click", function () {
                        BCRMTitle($(this).parent().parent().parent().find(".ui-dialog-title"), "Running...");
                    });
                }
            });
            setTimeout(function () {
                $("#bcrm_service").autocomplete({
                    source: bs,
                    select: function (e, ui) {
                        var t = ui.item.value;
                        if (t.indexOf("-[") > -1) {
                            sn = t.split("-[")[1]
                            sn = sn.substring(0, sn.length - 1);
                        }
                        else {
                            sn = t;
                        }
                        ms = BCRMGetBSMethod(sn);
                        var ma = [];
                        for (m in ms) {
                            ma.push(m);
                        }
                        $("#bcrm_method").parent().show();
                        $("#bcrm_add_prop").show();
                        $("#bcrm_method").autocomplete({
                            source: ma,
                            minLength: 0,
                            select: function (e, ui) {
                                $("input[id^='bcrm_ip']").each(function (x) {
                                    $(this).parent().remove();
                                });
                                var t = ui.item.value;
                                var ip = [];
                                var args = ms[t]["Business Service Method Arg"];
                                for (a in args) {
                                    if (args[a]["Type"].indexOf("Input") > -1) {
                                        //ip.push(a);
                                        var tip = $('<div style="padding:2px;background:whitesmoke;"><div style="width: 200px;float:left;"><label for="bcrm_ip">:</label></div><input style="width:300px;"></div>');
                                        var inpc = tip.find("input");
                                        var src = [];
                                        var asel = false;
                                        inpc.attr("id", "bcrm_ip_" + a);
                                        tip.find("label").text(a + ":");
                                        if (args[a]["Optional"] == "N") {
                                            tip.find("label").text(a + ":*");
                                            inpc.css("background", "#f5bcbc");
                                        }
                                        if (args[a]["Data Type"] == "Hierarchy" && args[a]["Storage Type"] == "Hierarchy") {
                                            inpc.attr("placeholder", "Child PropSet");
                                        }
                                        else {
                                            inpc.attr("placeholder", args[a]["Storage Type"] + ":" + args[a]["Data Type"]);
                                        }
                                        if (args[a]["Picklist"].indexOf("Integration Object") > -1) {
                                            src = BCRMGetIOList();
                                            asel = true;
                                        }
                                        if (args[a]["Picklist"].indexOf("Boolean") > -1) {
                                            src = ["true", "false"];
                                            asel = true;
                                        }
                                        if (asel) {
                                            inpc.autocomplete({
                                                source: src,
                                                minLength: 0,
                                                open: function () {
                                                    $(this).autocomplete('widget').css("z-index", "10000");
                                                }
                                            });
                                            inpc.focus(function () {
                                                $(this).autocomplete('search', $(this).val());
                                            });
                                            inpc.click(function () {
                                                $(this).autocomplete('search', "");
                                            });
                                        }
                                        $("#bcrm_method").parent().after(tip);
                                    }
                                }
                                if ($("#bcrm_service").val() == "Workflow Process Manager" && t == "RunProcess") {
                                    BCRMWorkflowRunner();
                                }

                            }
                        });
                        $("#bcrm_method").focus(function () {
                            $(this).autocomplete('search', $(this).val());
                        });
                        $("#bcrm_method").click(function () {
                            $(this).autocomplete('search', "");
                        });
                    }
                });
            }, 200)
        },
        close: function () {
            $(this).dialog("destroy");
        }
    });
}

//Workspace Banner
//Vanilla business service to the rescue
BCRMGetWSContext = function () {
    try{
        var wecp = SiebelApp.S_App.GetService("Web Engine Client Preferences");
        var ip = SiebelApp.S_App.NewPropertySet();
        var op = wecp.InvokeMethod("GetActiveWSContext", ip).GetChildByType("ResultSet");
        sessionStorage.BCRMCurrentWorkspaceVersion = op.GetProperty("WSVersion");
        sessionStorage.BCRMCurrentWorkspace = op.GetProperty("WSName");
        sessionStorage.BCRMCurrentWorkspaceStatus = op.GetProperty("ActiveWSStatus");
        BCRMWSUpdateWSBanner(sessionStorage.BCRMCurrentWorkspace, sessionStorage.BCRMCurrentWorkspaceVersion, sessionStorage.BCRMCurrentWorkspaceStatus);
    }
    catch(e){
        console.log("Error in BCRMGetWSContext: " + e.toString());
    }
};

SiebelApp.EventManager.addListner("AppInit", BCRMGetWSContext, this);
