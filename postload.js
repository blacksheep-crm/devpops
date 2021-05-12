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
//***************************************************************************
//blacksheep devpops
//EDUCATIONAL SAMPLE!!! DO NOT USE IN MISSION-CRITICAL ENVIRONMENTS!!!
//copy below code to vanilla postload.js for Siebel Web Tools enhancement demo

//globals, keep in postload.js
var bcrm_meta = {};
var devpops_storage = "devpopsStorage";
//set to true to enable responsibility check, this will prompt for user credentials intermittently
var bcrm_check_user_views = false;

//DOM element creator helper, supports Siebel Test Automation for custom DOM elements
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRM_ = function (s) {
    var retval = "";
    var b = btoa(s);
    for (var i = 0; i < b.length; i += 5) {
        retval += b[i];
    }
    if (retval.length > 25) {
        retval = retval.substring(0, 25);
    }
    return retval;
};

//DOM element creator, supports Siebel Test Automation for custom DOM elements
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRM$ = function (elem, attr, ataonly) {
    var retval;
    var jq;
    var tq = $(elem);
    var p = "BCRM";
    var id = tq.attr("id");
    var ata = {};
    if (typeof (attr) === "undefined") {
        attr = {};
    }
    if (typeof (attr.rn) === "undefined") {
        if (typeof (id) !== "undefined") {
            attr.rn = id;
        }
    }
    if (typeof (attr.un) === "undefined") {
        if (typeof (id) !== "undefined") {
            attr.un = id;
        }
    }
    if (SiebelApp.S_App.IsAutoOn() == "true") {
        ata[consts.get("SWE_PROP_AUTOM_OT")] = typeof (attr.ot) !== "undefined" ? attr.ot : "button";
        ata[consts.get("SWE_PROP_AUTOM_RN")] = typeof (attr.rn) !== "undefined" ? p + attr.rn : p + BCRM_(elem);
        ata[consts.get("SWE_PROP_AUTOM_UN")] = typeof (attr.un) !== "undefined" ? p + attr.un : p + BCRM_(elem);
        jq = $(elem);
        jq.attr(ata);
    }
    else {
        jq = $(elem);
    }
    if (ataonly) {
        retval = ata;
    }
    else {
        retval = jq;
    }
    return retval;
};
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

//moved to WT code for general support
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
//Collect user credentials for use in REST calls, stored as variable BCRM_BASIC_AUTH
var BCRM_BASIC_AUTH = "";
BCRMGetCredentials = function (next) {
    var dlg = $("<div id='bcrm_cred_dlg' style='display:grid;'>");
    var user = $("<input id='username' type='text' placeholder='User Name'>");
    var pw = $("<input id='password' type='password' placeholder='Password'>");
    dlg.append(user);
    dlg.append(pw);
    dlg.dialog({
        title: "Enter Credentials",
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
                if (next == "addview") {
                    BCRMAddView();
                }
                if (next == "upsertresp") {
                    BCRMUpsertResp();
                }
                if (next == "upsertrespdlg") {
                    BCRMUpsertRespDialog();
                }
                if (next == "screenmenu") {
                    var m = $("#bcrm_screen_menu");
                    m.find("a.ui-button").click();
                }
            },
            Cancel: function (e, ui) {
                $(this).dialog("destroy");
            }
        }
    });
};

//Experimental: the needs of the view
//requires custom "Base" IOs (Base Responsibility, Base View Access)

//Get List of custom responsibilities
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
var BCRM_CUSTOM_RESPS = [];
BCRMGetRespList = function () {
    if (true) {
        if (BCRM_BASIC_AUTH == "") {
            BCRMGetCredentials("getresplist");
        }
        else {
            BCRM_CUSTOM_RESPS = [];
            var url = location.origin + "/siebel/v1.0/data/Responsibility/Responsibility?uniformresponse=Y&childlinks=none&searchspec=[Id] NOT LIKE \"0*\"";
            var qd = $.ajax({
                dataType: "json",
                url: url,
                async: false,
                method: "GET",
                "headers": {
                    "Authorization": BCRM_BASIC_AUTH
                },
            });
            if (typeof (qd.responseJSON.items) !== "undefined") {
                for (i in qd.responseJSON.items) {
                    if (typeof (qd.responseJSON.items[i]["Name"]) !== "undefined")
                        BCRM_CUSTOM_RESPS.push(qd.responseJSON.items[i]["Name"]);
                }
            }
        }
    }
};

//Add View to View List
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMAddView = function (vn) {
    if (BCRM_BASIC_AUTH == "") {
        sessionStorage.BCRM_NEW_VIEW = vn;
        BCRMGetCredentials("addview");
    }
    else {
        if (typeof (vn) === "undefined") {
            vn = sessionStorage.BCRM_NEW_VIEW;
        }
        var url = location.origin + "/siebel/v1.0/data/View Access/Feature Access";
        var cd = $.ajax({
            dataType: "json",
            url: url,
            async: false,
            method: "POST",
            data: JSON.stringify({ "Name": vn }),
            headers: {
                "Authorization": BCRM_BASIC_AUTH,
                "Content-Type": "application/json"
            },
        });
    }
};

//Upsert Responsibility with View and current user
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMUpsertResp = function (rn, vn) {
    var cd = {};
    var firstauth = false;
    if (BCRM_BASIC_AUTH == "") {
        sessionStorage.BCRM_RESP = rn;
        if (typeof (vn) !== "undefined") {
            sessionStorage.BCRM_NEW_VIEW = vn;
        }
        cd.status = 0;
        BCRMGetCredentials("upsertresp");
    }
    else {
        if (typeof (rn) === "undefined") {
            firstauth = true;
            rn = sessionStorage.BCRM_RESP;
        }
        if (typeof (vn) === "undefined") {
            if (typeof (sessionStorage.BCRM_NEW_VIEW) !== "undefined") {
                vn = sessionStorage.BCRM_NEW_VIEW;
            }
        }
        if (typeof (vn) !== "undefined") {
            //add view (POST aka insert), just in case, ok if this fails (means the view is already in Views list)
            BCRMAddView(vn);
        }
        //query first, need to get Id because of PUT bug in some versions
        var rid;
        var url = location.origin + "/siebel/v1.0/data/Responsibility/Responsibility";
        var qd = $.ajax({
            dataType: "json",
            url: url + "?uniformresponse=Y&childlinks=none&fields=Name&searchspec=[Name]=\"" + rn + "\"",
            async: false,
            method: "GET",
            "headers": {
                "Authorization": BCRM_BASIC_AUTH
            },
        });
        if (typeof (qd.responseJSON.items) !== "undefined") {
            rid = qd.responseJSON.items[0]["Id"];
        }
        else {
            //presume responsibility does not exist
            rid = "dummy";
        }
        if (typeof (rid) !== "undefined") {
            //Upsert
            var data = {
                "Id": rid,
                "Name": rn,
                "Description": "created by devpops",
                "Primary Organization": "Default Organization",
                //"ListOfFeature Access": {},
                "ListOfUser": {
                    "User": {
                        "Login Name": SiebelApp.S_App.GetUserName()
                    }
                }
            };
            if (typeof (vn) !== "undefined") {
                data["ListOfFeature Access"] = {
                    "Feature Access": {
                        "Name": vn
                    }
                };
            }
            cd = $.ajax({
                dataType: "json",
                url: url,
                async: false,
                method: "PUT",
                data: JSON.stringify(data),
                headers: {
                    "Authorization": BCRM_BASIC_AUTH,
                    "Content-Type": "application/json"
                },
            });
            if (firstauth && typeof (cd.status) !== "undefined") {
                if (cd.status == 200) {
                    SiebelApp.Utils.Alert("View '" + vn + "' successfully registered with devpops Responsibility.");
                }
            }
        }
    }
    return cd;
};

//Helper for Screen View List Applet
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMPostInvokeHandler = function (m, i, c, r) {
    if (typeof (m) !== "undefined") {
        if (m.indexOf("PositionOnRow") == 0) {
            setTimeout(function () {
                BCRMEnhanceScreenViewListApplet();
            }, 200);
        }
    }
};

//Dialog to pick custom responsibility or define new one
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMUpsertRespDialog = function () {
    var pm = SiebelApp.S_App.GetActiveView().GetApplet("WT Repository Screen View List Applet").GetPModel();
    var r = pm.Get("GetRecordSet")[pm.Get("GetSelection")];
    var vn = r["View"];
    if (BCRM_BASIC_AUTH == "") {
        BCRMGetCredentials("upsertrespdlg");
    }
    else {
        BCRMGetRespList();
        var tempcss = ".ui-dialog {z-index: 1000!important;}";
        var st = $("<style bcrm-temp-style='yes'>" + tempcss + "</style>");
        if ($("style[bcrm-temp-style]").length == 0) {
            $("head").append(st);
        }
        var dlg = $('<div style="overflow:auto;"><div style="width: 100px;float:left;"><label for="bcrm_ip_resp">Responsibility:</label></div></div>');
        var inpc = $('<input style="width:200px;" id="bcrm_ip_resp">');
        inpc.autocomplete({
            source: BCRM_CUSTOM_RESPS,
            minLength: 0,
            open: function () {
                $(this).autocomplete('widget').css("z-index", "10000");
            },
            select: function (e, ui) {
                localStorage.BCRM_DEFAULT_RESP = ui.item.value;
            }
        });
        inpc.focus(function () {
            $(this).autocomplete('search', $(this).val());
        });
        inpc.click(function () {
            $(this).autocomplete('search', "");
        });
        dlg.dialog({
            title: "Pick or Add Responsibility",
            width: 500,
            height: 170,
            buttons: {
                "Register": function () {
                    var rn = $("#bcrm_ip_resp").val();
                    var cd = BCRMUpsertResp(rn, vn);
                    var s = cd.status;
                    if (s == 200) {
                        SiebelApp.Utils.Alert("View '" + vn + "' successfully registered with Responsibility '" + rn + "'.");
                    }
                    else if (s == 0) {
                        //this is fine
                    }
                    else {
                        SiebelApp.Utils.Alert("Something weird happened.\nPlease verify registration of View '" + vn + "'.");
                    }
                    $("style[bcrm-temp-style]").remove();
                    $(this).dialog("destroy");
                },
                "Cancel": function () {
                    $("style[bcrm-temp-style]").remove();
                    $(this).dialog("destroy");
                }
            },
            open: function () {
                $(this).append(inpc);
                if (typeof (localStorage.BCRM_DEFAULT_RESP) !== "undefined") {
                    $(inpc).val(localStorage.BCRM_DEFAULT_RESP);
                }
            }
        });
    }
}

//add button for the need of the view to Screen View List Applet
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMEnhanceScreenViewListApplet = function () {
    var pm = SiebelApp.S_App.GetActiveView().GetApplet("WT Repository Screen View List Applet").GetPModel();
    if (pm.Get("BCRM_HANDLERS_ATTACHED") != "true") {
        pm.AttachPMBinding("ShowSelection", BCRMEnhanceScreenViewListApplet, { scope: pm, sequence: true });
        pm.AddMethod("InvokeMethod", BCRMPostInvokeHandler, { sequence: true });
        pm.SetProperty("BCRM_HANDLERS_ATTACHED", "true");
    }
    var fi = pm.Get("GetFullId");
    var ae = $("#" + fi);
    var bg = ae.find(".siebui-btn-grp-applet");
    var r = pm.Get("GetRecordSet")[pm.Get("GetSelection")];
    var is_active = r["Inactive"] == "N" ? true : false;
    var vn = r["View"];
    if (vn == "") {
        is_active = false;
    }
    var btn;
    if (ae.find("#bcrm_reg_view").length == 0) {
        btn = $("<button id='bcrm_reg_view' style='cursor:pointer;border: 2px solid; padding: 4px; border-radius: 8px;  background: #d2e9f5;' title='The needs of the many outweigh the needs of the View\nAdd current View to Responsibility'>Register View</button>");
        bg.prepend(btn);
        btn.on("click", function () {
            BCRMUpsertRespDialog();
        })
    }
    else {
        btn = ae.find("#bcrm_reg_view");
    }
    if (!is_active) {
        btn.hide();
    }
    else {
        btn.show();
    }
};

//I hear the Screen Menu comes back in style

//Get details for a screen
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMGetWTScreenDetail = function (screen) {
    var url = location.origin + "/siebel/v1.0/workspace/MAIN/Screen/" + screen + "?uniformresponse=Y&childlinks=none&fields=Default View";
    var items = [];
    var det = {};
    var cd = $.ajax({
        dataType: "json",
        url: url,
        async: false
    });
    if (typeof (cd.responseJSON.items) !== "undefined") {
        items = cd.responseJSON.items;
        for (var i = 0; i < items.length; i++) {
            det = {};
            det["Default View"] = items[i]["Default View"];
        }
    }
    return det;
};

//Get application screen menu items
//Note, not filtered by responsibility (see todo section)
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMGetAppScreens = function (app) {
    var retval;
    //uses localStorage as "cache"
    if (typeof (localStorage.BCRM_WT_SCREENS) === "undefined") {
        var pagesize = 100;
        var url = location.origin + "/siebel/v1.0/workspace/MAIN/Application/" + app + "/Screen Menu Item?uniformresponse=Y&childlinks=none&fields=Screen,Text - Ref Exact,Sequence&searchspec=[Inactive]=\"N\"&sortspec=Sequence:asc&PageSize=" + pagesize;
        var items = [];
        var scr = {};
        var screens = {};
        var views = [];
        var det;
        var cd = $.ajax({
            dataType: "json",
            url: url,
            async: false
        });
        if (typeof (cd.responseJSON.items) !== "undefined") {
            items = cd.responseJSON.items;
            for (var i = 0; i < items.length; i++) {
                var scrn = items[i]["Screen"];
                if (scrn != "Employee ReadOnly  Screen" && scrn != "User Profile Screen") {
                    scr = {};
                    scr.Name = scrn;
                    scr.Text = items[i]["Text - Ref Exact"];
                    scr.Sequence = items[i]["Sequence"];
                    det = BCRMGetWTScreenDetail(scrn);
                    scr["Default View"] = det["Default View"];
                    views = BCRMGetWTScreenViews(scrn);
                    scr.Views = views;
                    screens[scrn] = scr;
                }
            }
        }
        localStorage.BCRM_WT_SCREENS = JSON.stringify(screens);
        retval = screens;
    }
    else {
        retval = JSON.parse(localStorage.BCRM_WT_SCREENS);
    }
    return retval;
};

//View access checker, calls BCRM View Helper business service via REST
//MUST enable BS access for "BCRM View Helper"/"CheckViews"
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
var BCRM_ALLOWED_VIEWS = [];
var BCRM_FORBIDDEN_VIEWS = [];
BCRMCheckViewAccess = function (views) {
    var acl;
    var to_check = [];
    for (var i = 0; i < views.length; i++) {
        if (BCRM_FORBIDDEN_VIEWS.indexOf(views[i]) == -1 && BCRM_ALLOWED_VIEWS.indexOf(views[i]) == -1) {
            to_check.push(views[i]);
        }
    }
    if (to_check.length > 0) {
        var url = location.origin + "/siebel/v1.0/service/BCRM View Helper/CheckViews";
        var data = { "body": { "viewlist": {} } };
        for (var i = 0; i < to_check.length; i++) {
            data["body"]["viewlist"][to_check[i]] = "";
        }
        var cd = $.ajax({
            dataType: "json",
            url: url,
            async: false,
            method: "POST",
            data: JSON.stringify(data),
            headers: {
                "Authorization": BCRM_BASIC_AUTH,
                "Content-Type": "application/json"
            },
        });
        if (cd.status == 200) {
            acl = cd.responseJSON.ACL;
            for (v in acl) {
                if (acl[v] == "Y") {
                    if (BCRM_ALLOWED_VIEWS.indexOf(v) == -1) {
                        BCRM_ALLOWED_VIEWS.push(v);
                    }
                }
                else {
                    if (BCRM_FORBIDDEN_VIEWS.indexOf(v) == -1) {
                        BCRM_FORBIDDEN_VIEWS.push(v);
                    }
                }
            }
        }
        else {
            //nothing
        }
    }
};

//Get screen views for a screen
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMGetWTScreenViews = function (screen) {
    //only allow vanilla views
    var vanilla = ["Accessibility Applet Attributes View", "Accessibility View Attributes View", "Admin - Restricted Menu Items", "Alert Admin View", "Application Admin View Order View", "Application Data Rule Expression View", "Batch Component Admin View", "Batch Job Submission View", "Business Process Access View", "Business Service Access View", "Business Service List View", "Business Service Methods List View", "Business Service Script Editor View", "Business Service Test View", "Business Service User Properties View", "XA Administration Detail View", "Component Job View", "Contact Us Mail Address Administration View", "Contact Us Email Subject Administration View", "Contact Us Mail Address Administration View", "Enterprise Compgroup View (Configuration)", "Enterprise Component Definition View (Configuration)", "Enterprise Explorer View (Configuration)", "Enterprise Parameters View", "Enterprise Server/Server View", "FINCORP Org Category Admin List View", "FINS Approval Administration View", "FINS Authentication Administration View", "FINS Authentication Template View", "FINS CEM Admin View", "FINS CF Fair Market Value Auction Admin View", "FINS CF Fair Market Value FMV Admin View", "FINS CF Vehicle Residuals Reference Data Admin View", "FINS Calculation Manager Rule Set View", "FINS Data Map Admin View", "Knowledge Management Admin View", "LS Pharma Smart Call Template Admin Detail View", "Manifest Expression List View", "Manifest File List View", "Message Map View", "Navigation Links Admin View", "Pharma Admin Medical Procedure View", "Pharma Admin Plan View", "Pharma Admin Professional Primary Specialty", "Pharma Template Call List View", "Predefined Query Administration View", "Process Failure Diagnostics", "Product Line Fee Administration View", "Quick Fill Templates Administration View", "RS Admin Profile View", "Registered Task Administration View", "Repeating Batch Job List View", "Repository UI EIM Attribute Mapping Detail View", "Repository UI EIM Foreign Key Mapping Detail View", "Repository UI EIM Interface Table Column Detail View", "Repository UI EIM Interface Table List View", "Repository UI EIM Primary Mapping Detail View", "Repository UI EIM Table User Key Detail View", "Repository UI Table Column Detail View", "Repository UI Table Column List View", "Repository UI Table Data Source Detail View", "Repository UI Table Index Column Detail View", "Repository UI Table User Key Attribute Join Detail View", "Repository UI Table User Key Attribute Tree Node Detail View", "Repository UI Table User Key Column Detail View", "Responsibility Administration View", "Responsibility Detail  -  Business Process Access View", "Responsibility Detail  -  Business Service Access View", "Responsibility Detail - Tab Layout View", "Responsibility Detail - Tasks View", "Runtime Config Version Info", "Runtime Config Version Info", "SA-VBC Alert Definitions View", "SA-VBC Named Subsystem View", "SRF Vlink Public Screen View View", "Server Server /Parameter View (Configuration)", "Server Server/Compgroup View", "Server Server/Component/Event Configuration View", "Server Server/Component/Parameter View", "Server Server/Component/State Value View", "Server Server/Component/Statistic View", "Server Server/Component/Task View", "Server Server/Info Log View", "Server Server/Server Event Configuration", "Server Server/Session View", "Server Server/Statistic View", "Server Server/Task View", "Server Session/Info Log View", "Server Session/Parameter View", "Server Session/State Value View", "Server Session/Statistic View", "Server Task History List View", "Server Task/Info Log View", "Server Task/Parameter View", "Server Task/State Value View", "Server Task/Statistic View", "Service Locator Admin View", "Service Request Assignment View", "Siebel License Key View", "State Model Detail View", "State Model Detail View - Categories", "State Model Detail View - States", "State Model List View", "System Preferences", "Task Administration View", "UI Object List View", "Usage Pattern Tracking List View", "View Administration View", "WSUI Conflict Resolution View", "WSUI Dashboard View", "WSUI Delivered View", "eAuto Dealer Locator Admin View", "eEvents Session Template Admin View"];
    if (bcrm_check_user_views) {
        BCRMCheckViewAccess(vanilla);
    }
    var url = location.origin + "/siebel/v1.0/workspace/MAIN/Screen/" + screen + "/Screen View?uniformresponse=Y&childlinks=none&fields=View,Menu Text - Ref Default,Sequence,Parent Category&searchspec=[Inactive]=\"N\" AND [View] IS NOT NULL&pagesize=200&sortspec=Parent Category:asc,Sequence:asc";
    var items = [];
    var view = {};
    var views = [];
    var cd = $.ajax({
        dataType: "json",
        url: url,
        async: false
    });
    if (typeof (cd.responseJSON.items) !== "undefined") {
        items = cd.responseJSON.items;
        for (var i = 0; i < items.length; i++) {
            var vn = items[i]["View"];
            if (bcrm_check_user_views && BCRM_ALLOWED_VIEWS.length > 0) {
                vanilla = BCRM_ALLOWED_VIEWS;
            }
            if (vanilla.indexOf(vn) >= 0) {
                view = {};
                view.Name = items[i]["View"];
                view.Text = items[i]["Menu Text - Ref Default"];
                view.Sequence = items[i]["Sequence"];
                view.Parent = items[i]["Parent Category"];
                views.push(view);
            }
        }
    }
    return views;
};

//Create Screen Menu
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMCreateScreenMenu = function () {
    var tm = $("<ul id='bcrm_scr_menu_ul' style='display:none;' class='depth-0'></ul>");
    var vc, vi, tt, cat;
    var cats = [];
    var screens = BCRMGetAppScreens(SiebelApp.S_App.GetName());
    var rscr;
    //Recently used views
    var rviews = BCRMGetStorageItem(devpops_storage, SiebelApp.S_App.GetUserName() + "@wt_rec_views");
    if (typeof (rviews) !== "undefined") {
        rscr = {
            "Name": "Recent Views",
            "Text": "Recent Views",
            "Sequence": "1",
            "Default View": ""
        };
        var trev = JSON.parse(rviews);
        trev.reverse();
        rscr.Views = trev;
        var tscreens = {};
        tscreens["Recent Views"] = rscr;
        for (s in screens) {
            tscreens[s] = screens[s];
        }
        screens = tscreens;
    }
    for (s in screens) {
        if (typeof (screens[s]["Text"]) !== "undefined") {
            var t = screens[s]["Text"].replaceAll("&", "");
            var defv = screens[s]["Default View"];
            var sc;
            if (bcrm_check_user_views && BCRM_ALLOWED_VIEWS.indexOf(defv) == -1) {
                sc = $("<li class='siebui-appmenu-item ui-menu-item'><a href='javascript:void(0)'>" + t + "</a></li>");
            }
            else {
                sc = $("<li class='siebui-appmenu-item ui-menu-item'><a title='" + defv + "' bcrm-view='" + defv + "' href='javascript:void(0)'>" + t + "</a></li>");
                sc.find("a").on("click", function () {
                    var v = $(this).attr("bcrm-view");
                    if (v != "") {
                        $("#bcrm_screen_menu").find("ul.depth-0").remove();
                        SiebelApp.S_App.GotoView(v);
                    }
                });
            }
            sc.find("a").on("mouseover", function () {
                $(this).css("background", "#1474bf");
            });
            sc.find("a").on("mouseout", function () {
                $(this).css("background", "");
            });
            cats = [];
            if (screens[s]["Views"].length > 0) {
                vc = $("<ul class='depth-1'></ul>");
                for (vx = 0; vx < screens[s]["Views"].length; vx++) {
                    var tv = screens[s]["Views"][vx];
                    cat = tv["Parent"];
                    if (cats.length == 0) {
                        vi = $("<li class='bcrm-category' ><a style='font-weight:bold;' title='" + cat + "' href='javascript:void(0)'>" + cat + "</a></li>");
                        vc.append(vi);
                        cats.push(cat);
                    }
                    else {
                        if (cats.indexOf(cat) == -1) {
                            vi = $("<li class='bcrm-category'><a style='font-weight:bold;' title='" + cat + "' href='javascript:void(0)'>" + cat + "</a></li>");
                            vc.append(vi);
                            cats.push(cat);
                        }
                    }
                    if (typeof (tv["Text"]) !== "undefined") {
                        tt = tv["Text"].replaceAll("&", "");
                        vi = $("<li class='siebui-appmenu-item ui-menu-item'><a style='font-size:0.95em!important;padding-left:20px!important;' title='" + tv["Name"] + "' href='javascript:void(0)'>" + tt + "</a></li>");
                        vi.find("a").on("contextmenu", function () {
                            var del = SiebelApp.Utils.Confirm("Click OK to delete this entry.\nClick Cancel to abort.\n\nReload might be needed after delete.");
                            if (del) {
                                var v = $(this).attr("title");
                                BCRMRemoveRecentView(v);
                            }
                            return false;
                        });
                        vi.find("a").on("click", function () {
                            var rv;
                            var v = $(this).attr("title");
                            if (v != "") {
                                $("#bcrm_screen_menu").find("ul.depth-0").remove();
                                var rviews = BCRMGetStorageItem(devpops_storage, SiebelApp.S_App.GetUserName() + "@wt_rec_views");
                                if (typeof (rviews) === "undefined") {
                                    rv = [];
                                    for (s in screens) {
                                        if (s != "Recent Views") {
                                            for (var j = 0; j < screens[s]["Views"].length; j++) {
                                                if (screens[s]["Views"][j]["Name"] == v) {
                                                    rv.push(screens[s]["Views"][j]);
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    BCRMSetStorageItem(devpops_storage, SiebelApp.S_App.GetUserName() + "@wt_rec_views", JSON.stringify(rv), "Web Tools Recent Views");
                                }
                                else {
                                    rv = JSON.parse(rviews);
                                    var found = false
                                    for (var i = 0; i < rv.length; i++) {
                                        if (rv[i]["Name"] == v) {
                                            found = true;
                                            break;
                                        }
                                    }
                                    if (!found) {
                                        for (s in screens) {
                                            if (s != "Recent Views") {
                                                for (var j = 0; j < screens[s]["Views"].length; j++) {
                                                    if (screens[s]["Views"][j]["Name"] == v) {
                                                        rv.push(screens[s]["Views"][j]);
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                        BCRMSetStorageItem(devpops_storage, SiebelApp.S_App.GetUserName() + "@wt_rec_views", JSON.stringify(rv), "Web Tools Recent Views");
                                    }
                                }
                                SiebelApp.S_App.GotoView(v);
                            }
                        });
                        vi.find("a").on("mouseover", function () {
                            $(this).css("background", "#1474bf");
                        });
                        vi.find("a").on("mouseout", function () {
                            $(this).css("background", "");
                        });
                        vc.append(vi);
                    }
                }
                sc.append(vc);
            }
            tm.append(sc);
        }
    }
    return tm;
};

//Add Screen Menu button
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMAddWTScreenMenu = function () {
    var m;
    if ($("#bcrm_screen_menu").length == 0) {
        m = $('<li title="This Screen Menu is brought to you by devpops.\nBe gentle." id="bcrm_screen_menu" class="siebui-appmenu-item ui-menubar-item" role="presentation"><a href="javascript:void(0)" class="ui-button ui-widget ui-button-text-only ui-menubar-link" role="menuitem" aria-haspopup="true"><span class="ui-button-text">Screens</span></a></li>');
        $(".ui-menubar").append(m);
        m.find("a").on("mouseover", function () {
            $(this).css("background", "#1474bf");
        });
        m.find("a").on("mouseout", function () {
            $(this).css("background", "");
        });
    }
    //var tm = BCRMCreateScreenMenu();
    m = $("#bcrm_screen_menu");
    m.find("a.ui-button").on("click", function (e) {
        e.stopImmediatePropagation();
        if (bcrm_check_user_views && BCRM_BASIC_AUTH == "") {
            localStorage.removeItem("BCRM_WT_SCREENS");
            BCRMGetCredentials("screenmenu");
        }
        else {
            if ($("#bcrm_screen_menu").find("ul.depth-0").length == 0) {
                var tm = BCRMCreateScreenMenu();
                tm.toggle();
                tm.menu({
                    items: "> :not(.bcrm-category)"
                });
                m.append(tm);
            }
            else {
                $("#bcrm_screen_menu").find("ul.depth-0").remove();
            }
        }
    });
};

//Remove a view entry from user's recently used view list
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMRemoveRecentView = function (vn) {
    var rviews = JSON.parse(BCRMGetStorageItem(devpops_storage, SiebelApp.S_App.GetUserName() + "@wt_rec_views"));
    if (typeof (rviews) !== "undefined") {
        for (var i = 0; i < rviews.length; i++) {
            if (rviews[i]["Name"] == vn) {
                rviews.splice(i, 1);
                break;
            }
        }
    }
    BCRMSetStorageItem(devpops_storage, SiebelApp.S_App.GetUserName() + "@wt_rec_views", JSON.stringify(rviews));
};

//Next generation storage with 16k capacity and no custom table

//Check if storage IO is in place
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
//dependency on Base BCRM devpops Storage IO
BCRMStorageCheck = function () {
    var retval = false;
    var url = location.origin + "/siebel/v1.0/data/BCRM devpops Storage/Business Service/describe";
    var cd;
    if (localStorage.BCRM_STORAGE_CHECK != "true") {
        cd = $.ajax({
            dataType: "json",
            url: url,
            async: false
        });
        if (cd.status == 200) {
            localStorage.BCRM_STORAGE_CHECK = "true";
            retval = true;
        }
    }
    if (localStorage.BCRM_STORAGE_CHECK == "true") {
        retval = true;
    }
    return retval;
};

//Get Row Id of storage record
//creates storage record if readonly=false
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMGetStorageId = function (rn, readonly) {
    var retval;
    if (BCRMStorageCheck() == true) {
        //query first, need to get Id because of PUT bug in some versions
        var rid;
        var url = location.origin + "/siebel/v1.0/data/BCRM devpops Storage/Business Service?uniformresponse=Y";
        var qd = $.ajax({
            dataType: "json",
            url: url + "&childlinks=none&fields=Name&searchspec=[Name]=\"" + rn + "\"",
            async: false,
            method: "GET"
        });
        if (typeof (qd.responseJSON.items) !== "undefined") {
            rid = qd.responseJSON.items[0]["Id"];
            retval = rid;
        }
        else {
            //presume it does not exist
            rid = "dummy";
        }
        if (!readonly) {
            if (rid == "dummy") {
                //Upsert
                var data = {
                    "Name": rn,
                    "Comments": "EXPERIMENTAL: Used by devpops for data persistence",
                    "Display Name": rn,
                    "Hidden": "Y",
                    "Cache": "N",
                    "Inactive": "Y",
                    "Id": rid
                };
                cd = $.ajax({
                    dataType: "json",
                    url: url,
                    async: false,
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(data)
                });
                if (typeof (cd.responseJSON.items) !== "undefined") {
                    rid = cd.responseJSON.items[0]["Id"];
                    retval = rid;
                }
            }
        }
    }
    return retval;
};

//Write item to storage, sdata must be a string (objects must be stringified when "set" and parsed after "get")
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMSetStorageItem = function (rn, sn, sdata, com) {
    var retval = false;
    if (BCRMStorageCheck() == true) {
        if (typeof (com) === "undefined") {
            com = "created by devpops";
        }
        var rid = BCRMGetStorageId(rn);
        if (typeof (rid) !== "undefined") {
            var url = location.origin + "/siebel/v1.0/data/BCRM devpops Storage/Business Service?uniformresponse=Y";
            //Upsert
            var data = {
                "Name": rn,
                "Id": rid,
                "ListOfBusiness Service Script": {
                    "Business Service Script": {
                        "Name": sn,
                        "Program Language": "JS",
                        "Inactive": "Y",
                        "Comments": com,
                        "Script": sdata
                    }
                }
            };
            cd = $.ajax({
                dataType: "json",
                url: url,
                async: false,
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(data)
            });
            if (cd.status == 200) {
                retval = true;
            }
        }
    }
    return retval;
};

//Get value of a storage item, object data must be parsed after retrieval
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMGetStorageItem = function (rn, sn) {
    var retval;
    if (BCRMStorageCheck() == true) {
        var rid = BCRMGetStorageId(rn, true);
        if (typeof (rid) !== "undefined") {
            var url = location.origin + "/siebel/v1.0/data/BCRM devpops Storage/Business Service/" + rid + "/Business Service Script?uniformresponse=Y&fields=Script&childlinks=none&searchspec=[Name]=\"" + sn + "\"";
            cd = $.ajax({
                dataType: "json",
                url: url,
                async: false,
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (typeof (cd.responseJSON.items) !== "undefined") {
                retval = cd.responseJSON.items[0]["Script"];
            }
        }
    }
    return retval;
};

//main postload function for Web Tools
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMWTHelper = function () {
    try {
        //enhance Web Tools
        if (SiebelApp.S_App.GetAppName() == "Siebel Web Tools") {
            var vn = SiebelApp.S_App.GetActiveView().GetName();
            BCRMWebToolsEnhancer();

            //experimental: the need of the view
            if (vn == "WT Repository Screen View List View") {
                BCRMEnhanceScreenViewListApplet();
            }

            //add screen menu
            BCRMAddWTScreenMenu();

            console.log("BCRM devpops extension for Siebel Web Tools loaded");
        }
    }
    catch (e) {
        console.log("Error in BCRMWTHelper: " + e.toString());
    }
};

//register Web Tools postload listener
try {
    if (location.pathname.indexOf("webtools") > -1) {
        SiebelApp.EventManager.addListner("postload", BCRMWTHelper, this);
    }
}
catch (e) {
    console.log("Error in BCRM devpops extension for Siebel Web Tools: " + e.toString());
}

//Tools online help https://docs.oracle.com/cd/F26413_16/portalres/pages/other_toolshelp.htm
//END WSTOOLS postload.js content