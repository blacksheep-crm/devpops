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
var bcrm_help_map = {
    "20.1": "F26413_01",
    "20.2": "F26413_02",
    "20.3": "F26413_03",
    "20.4": "F26413_04",
    "20.5": "F26413_05",
    "20.6": "F26413_06",
    "20.7": "F26413_07",
    "20.8": "F26413_08",
    "20.9": "F26413_09",
    "20.10": "F26413_10",
    "20.11": "F26413_11",
    "20.12": "F26413_12",
    "21.1": "F26413_13",
    "21.2": "F26413_14",
    "21.3": "F26413_15",
    "21.4": "F26413_16",
    "21.5": "F26413_17",
    "21.6": "F26413_18",
    "21.7": "F26413_19",
    "21.8": "F26413_20",
    "21.9": "F26413_21",
    "21.10": "F26413_22",
    "21.11": "F26413_23",
    "21.12": "F26413_24",
    "22.1": "F26413_25",
    "22.2": "F26413_26",
    "22.3": "F26413_27",
    "22.4": "F26413_28",
    "22.5": "F26413_29",
    "22.6": "F26413_30",
    "22.7": "F26413_31",
    "22.8": "F26413_32",
    "22.9": "F26413_33",
    "22.10": "F26413_34",
    "22.11": "F26413_35",
    "22.12": "F26413_36",
    "23.1": "F26413_37",
    "23.2": "F26413_38",
    "23.3": "F26413_39",
    "23.4": "F26413_40",
    "23.5": "F26413_41",
    "23.6": "F26413_42",
    "23.7": "F26413_43",
    "23.8": "F26413_44",
    "23.9": "F26413_45",
    "23.10": "F26413_46",
    "23.11": "F26413_47",
    "23.12": "F26413_48",
};

var icon_map = new Map();
icon_map.set("Applet", "🍎");
icon_map.set("Application", "📶");
icon_map.set("Business Component", "🍌");
icon_map.set("Business Object", "🍱");
icon_map.set("Business Service", "🚛");
icon_map.set("Class", "🏛");
icon_map.set("Command", "💥");
icon_map.set("Icon Map", "❄");
icon_map.set("Integration Object", "🎬");
icon_map.set("Link", "🔗");
icon_map.set("Menu", "📮");
icon_map.set("Message Category", "📞");
icon_map.set("Pick List", "📃");
icon_map.set("Screeen", "🖥");
icon_map.set("Symbolic String", "🎸");
icon_map.set("Table", "🎹");
icon_map.set("Task", "⚒");
icon_map.set("Task Group", "🍇");
icon_map.set("Toolbar", "🛠");
icon_map.set("View", "📈");
icon_map.set("Web Page", "🕸");
icon_map.set("Web Template", "🍕");
icon_map.set("Workflow Process", "🍽");

//Banner prettifier
var bannerint;
BCRMPrettifyBanner = function () {
    var redwood = [
        "https://docs.oracle.com/cd/F26413_16/portalres/images/Abstracts_Light_3.png",
        "https://docs.oracle.com/cd/F26413_13/portalres/images/Abstracts_Winter_1.png",
        "https://docs.oracle.com/cd/F26413_10/portalres/images/Abstracts_Open_Dark_5.png",
        "https://docs.oracle.com/cd/F26413_09/portalres/images/Abstracts_Autumn_1.png",
        "https://docs.oracle.com/cd/F26413_08/portalres/images/Abstracts_Summer_1.png",
        "https://docs.oracle.com/cd/F26413_24/portalres/images/Abstracts_Winter_1.png",
        "https://docs.oracle.com/cd/F26413_26/portalres/images/Abstracts_Plum.png",
        "https://docs.oracle.com/cd/F26413_30/portalres/images/Abstracts_Light_5.png"
    ];
    var modes = ["normal", "multiply", "screenoverlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];
    var bg = redwood[Math.floor((Math.random() * redwood.length))];
    var mode = modes[Math.floor((Math.random() * modes.length))];
    //let's try something new (redwood-ish bg retired)
    bg = "enu/help/oxygen-webhelp/template/variants/tree/oracle/resources/images/tealblue_top_banner.jpg";
    $("#_sweappmenu").css("background-image", "url(" + bg + ")");
    $("#_sweappmenu").css("background-size", "cover");
    $("#_sweappmenu").css("background-color", "#aa529b");
    $("#_sweappmenu").css("background-position", "top");
    $("#_sweappmenu").css("background-blend-mode", mode);
    //$("#_sweappmenu").css("background-position-y", 3300 * Math.random() + "px");
    $(".applicationMenu").css("background", "transparent");
    $(".siebui-search-toolbar-options").css("background", "transparent");
    $(".siebui-nav-hb-btn").css("background", "transparent");
    $(".siebui-appmenu-toggle").css("background", "transparent");
    if (typeof (bannerint) !== "undefined") {
        clearInterval(bannerint);
    }
    /*
    bannerint = setInterval(function () {
        var bpy = parseFloat($("#_sweappmenu").css("background-position-y"));
        $("#_sweappmenu").css("background-position-y", bpy + 0.1 + "px");
    }, 100);
    $("#_sweappmenu").css("background-position-y");
    */
};

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
        classes: {
            "ui-dialog": "bcrm-dialog"
        },
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
                if (next == "updlistcols") {
                    BCRMUpdateListColumns(BULC_PM, BULC_FMAP, true, true);
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
            classes: {
                "ui-dialog": "bcrm-dialog"
            },
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

//devpops 22.10 new features:

//Inject custom CSS
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMInjectCSS = function (name, css) {
    var st = $("<style bcrm-temp-style_" + name + "='yes'>" + css + "</style>");
    if ($("style[bcrm-temp-style_" + name + "]").length == 0) {
        $("head").append(st);
    }
};
BCRMUnInjectCSS = function (name) {
    if ($("style[bcrm-temp-style_" + name + "]").length > 0) {
        $("style[bcrm-temp-style_" + name + "]").remove();
    }
};

//Auto Column Resize: Add button (call from PR)
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMAddAutoResizeButton = function (pm) {
    if (typeof (pm.Get) === "function") {
        var pr = pm.GetRenderer();
        var fi = pm.Get("GetFullId");
        var id = pm.Get("GetId");
        var ae = $("#" + fi);
        var bg = ae.find(".siebui-btn-grp-applet");
        var btntext = "↔";

        if (bg.length == 0) {
            bg = ae.find("#s_" + id + "_rc").parent();
        }

        var bid = "bcrm_autocol_btn_" + id;
        if ($("#" + bid).length == 0) {
            var btn = $("<span><button id='" + bid + "' title='Auto-resize columns' style='font-size:1.3em;cursor:pointer;border:none;background:transparent;'>" + btntext + "</button></span>");
            bg.append(btn);
            btn.on("click", function () {
                SiebelApp.S_App.uiStatus.Busy({
                    target: SiebelApp.S_App.GetTargetViewContainer(),
                    mask: true
                });
                setTimeout(function () {
                    BCRMAutoResizeColumns(pm);
                    setTimeout(function () {
                        SiebelApp.S_App.uiStatus.Free();
                    }, 100);
                }, 10);
            });
        }
    }
}

//Auto Resize Columns Handler (call from BindData or PM Binding)
//restricted to popup applets
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMAutoResizeHandler = function (pm) {
    if (typeof (pm.Get) === "function") {
        if (pm.Get("IsPopup")) {
            var ap = SiebelApp.S_App.GetActiveView().GetApplet(pm.GetObjName());
            var isquery = ap.IsInQueryMode();
            if (!isquery) {
                if (pm.Get("BCRM_AUTO_RESIZE_COLS") != "true") {
                    setTimeout(function () {
                        BCRMAutoResizeColumns(pm);
                    }, 100);
                    pm.SetProperty("BCRM_AUTO_RESIZE_COLS", "true");
                }
            }
        }
    }
}

//Auto Resize Columns execution
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMResizeCol = function (pm, colname, nw) {
    if (typeof (pm.Get) === "function") {
        var pr = pm.GetRenderer();
        var idx = 0;
        nw = parseInt(nw, 10);
        var cm = pr.GetGrid().jqGrid("getGridParam", "colModel");
        var pm = pr.GetPM();
        var ph = pm.Get("GetPlaceholder");
        var ts = $("table#" + ph + ".ui-jqgrid-btable");
        var t = ts[0].grid;
        var p = pr.GetGrid()[0].p;

        //get column index
        for (idx = 0; idx < cm.length; idx++) {
            if (cm[idx].name == colname) {
                break;
            }
        }

        if (cm[idx].width != nw) {
            cm[idx].width = nw;
            t.headers[idx].width = nw;
            t.headers[idx].el.style.width = nw + "px";
            t.cols[idx].style.width = nw + "px";

            if (t.footers.length > 0) { t.footers[idx].style.width = nw + "px"; }
            if (p.forceFit === true) {
                nw = t.headers[idx + p.nv].newWidth || t.headers[idx + p.nv].width;
                t.headers[idx + p.nv].width = nw;
                t.headers[idx + p.nv].el.style.width = nw + "px";
                t.cols[idx + p.nv].style.width = nw + "px";
                if (t.footers.length > 0) { t.footers[idx + p.nv].style.width = nw + "px"; }
                p.colModel[idx + p.nv].width = nw;
            } else {
                p.tblwidth = t.newWidth || p.tblwidth;
                $('table:first', t.bDiv).css("width", p.tblwidth + "px");
                $('table:first', t.hDiv).css("width", p.tblwidth + "px");
                t.hDiv.scrollLeft = t.bDiv.scrollLeft;
                if (p.footerrow) {
                    $('table:first', t.sDiv).css("width", p.tblwidth + "px");
                    t.sDiv.scrollLeft = t.bDiv.scrollLeft;
                }
            }
            $(ts).triggerHandler("jqGridResizeStop", [nw, idx]);
            if ($.isFunction(p.resizeStop)) { p.resizeStop.call(ts, nw, idx); }
        }
    }
}


//Auto Resize Columns main function
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMAutoResizeColumns = function (pm) {
    if (typeof (pm.Get) === "function") {
        try {
            var pr = pm.GetRenderer();
            var pm = pr.GetPM();
            var an = pm.GetObjName();
            var rs = pm.Get("GetRecordSet");
            var cs = pm.Get("GetControls");
            var r, field, record, cn, fn;
            var padding = 20;
            var maxwidth = 500;
            var nw;
            var spt;
            var ch = pr.GetColumnHelper();
            var cm = ch.GetColMap();
            var minwidth = new Map();


            //22.10.2: write back to repository
            var cf = ch.GetColField();
            var lcn;
            var repowidth = new Map();
            var listcols = {};


            var nr = rs.length;
            if (nr > 0) {
                //add display names as virtual record (column header should not be truncated)
                rs[nr] = {};
                for (ct in cs) {
                    fn = cs[ct].GetFieldName();
                    if (fn != "" && cs[ct].GetDisplayName() != "") {
                        rs[nr][fn] = cs[ct].GetDisplayName();
                    }
                }


                for (r in rs) {
                    record = rs[r];
                    for (field in record) {
                        //find col name
                        for (col in cm) {
                            if (cm[col] == field) {
                                //get repository name of list column
                                lcn = cf[field];
                                //get PR colum name
                                cn = col;
                                break;
                            }
                        }

                        if (record[field].length >= 0) {
                            //add to map
                            if (!minwidth.has(cn)) {
                                minwidth.set(cn, 0);
                            }
                            if (!repowidth.has(field)) {
                                repowidth.set(field, 0);
                            }

                            /* this is accurate but slow
                            //measure minimum length for column
                            spt = $("<span>" + record[field] + "</span>");
                            //spt.text = record[field];
                            $("body").append(spt);
                            nw = spt[0].offsetWidth;
                            //spt.hide();
                            nw = nw + padding;
                            spt.remove();
                            */

                            /*faster but less accurate*/
                            nw = record[field].length * 6.3;
                            nw = nw + padding;

                            if (nw >= maxwidth) {
                                nw = maxwidth;
                            }

                            //round up to next 10 as Int
                            nw = Math.ceil(parseInt(nw) / 10) * 10;

                            //overwrite map if new width is greater than existing entry
                            if (minwidth.get(cn) < nw) {
                                minwidth.set(cn, nw);
                                repowidth.set(field, nw);
                            }
                        }
                    }
                }
                //call resize function for each column

                minwidth.forEach((newwidth, colname) => {
                    if (typeof (colname) !== "undefined") {
                        //Web Tools Writable column, set to 100px to allow for avatars
                        if (colname == "Writable") {
                            newwidth = 100;
                        }
                        if (newwidth > 0) {
                            BCRMResizeCol(pm, colname, newwidth);
                        }
                    }
                });

                //call repo update function
                if (SiebelApp.S_App.GetAppName() != "Siebel Web Tools") {
                    if (sessionStorage.BCRMCurrentWorkspaceStatus == "Edit-In-Progress") {
                        BCRMUpdateListColumns(pm, repowidth);
                    }
                }
            }
        }
        catch (e) {
            console.log("Error in BCRMAutoResizeColumns: " + e.toString());
        }
    }
}

//Persist List Column Width to Repository
var BULC_PM;
var BULC_FMAP;
BCRMUpdateListColumns = function (pm, fields, skipDisplay = false, go = false) {
    BULC_PM = pm;
    BULC_FMAP = fields;
    var ws = sessionStorage.BCRMCurrentWorkspace;
    var wss = sessionStorage.BCRMCurrentWorkspaceStatus;
    var pr = pm.GetRenderer();
    var ch = pr.GetColumnHelper();
    var cm = ch.GetColMap();
    var cf = ch.GetColField();
    var cs = pm.Get("GetControls");
    var an = pm.GetObjName();
    var lcols = new Map();
    var ucol = {
        "Name": "",
        "HTML Width": ""
    };
    var requestOptions;
    var myHeaders = new Headers();

    if (wss == "Edit-In-Progress") {
        var dlg = $("<div>");
        var hdr = $("<h3>" + "Applet: " + an + "</h3><h4>" + "Workspace: " + ws + "</h4>");
        var grid = $("<div style='display:grid;height:300px;overflow-y:auto;grid-auto-rows: min-content;'>");
        dlg.append(hdr);

        //map fields to list columns
        fields.forEach((w, fn) => {
            lcols.set(cf[fn], w);
        });
        //generate dialog
        fields.forEach((w, fn) => {
            let dn;
            let prcol;
            for (c in cs) {
                if (cs[c].GetFieldName() == fn) {
                    dn = cs[c].GetDisplayName();
                    break;
                }
            }
            for (col in cm) {
                if (cm[col] == fn) {
                    prcol = col;
                    break;
                }
            }
            let row = $("<div style='display: grid;grid-template-columns: 60% auto;height:24px;margin-bottom: 4px;'>");
            let lbl = $("<div>" + dn + ":</div>");
            let val = $("<input id='" + prcol + "' colname='" + cf[fn] + "' fn='" + fn + "' oldval='" + w + "' type='number' step='5' style='width:45px;height:18px;'>");
            val.val(w);
            if (typeof (prcol) !== "undefined") {
                row.append(lbl);
                row.append(val);
                grid.append(row);
            }
        });

        dlg.append(grid);
        if (!skipDisplay) {
            dlg.dialog({
                width: 400,
                height: 500,
                title: "🦎 Lizard",
                classes: {
                    "ui-dialog": "bcrm-dialog"
                },
                buttons: {
                    "Preview": function () {
                        $(this).dialog().find("input").each(function (x) {
                            if (parseInt($(this).val()) != parseInt($(this).attr("oldval"))) {
                                let colname = $(this).attr("id");
                                BCRMResizeCol(pm, colname, parseInt($(this).val()));
                            }
                        });
                    },
                    "Save to Workspace": function (e, ui) {
                        $(this).dialog().find("input").each(function (x) {
                            if (parseInt($(this).val()) > 0) {
                                let fn = $(this).attr("fn");
                                fields.set(fn, parseInt($(this).val()));
                            }
                        });
                        BULC_FMAP = fields;
                        BCRMUpdateListColumns(pm, fields, true, true);
                    },
                    "Close": function () {
                        $(this).dialog("destroy");
                    }
                }
            });
            //go = SiebelApp.Utils.Confirm("The following List Columns will be updated:\n" + msg);
        }
        if (go) {
            if (BCRM_BASIC_AUTH == "") {
                BCRMGetCredentials("updlistcols");
            }
            else {
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Authorization", BCRM_BASIC_AUTH);

                //touch applet
                //get original comments
                var url = location.origin + "/siebel/v1.0/workspace/" + ws + "/Applet/" + an + "?fields=Comments&childlinks=none";
                var ocom;
                var ncom;
                let today = new Date().toISOString().slice(0, 10);
                var icom = "devpops_lizard_" + today + "_" + ws;
                var qd = $.ajax({
                    dataType: "json",
                    url: url,
                    async: false,
                    method: "GET",
                    headers: {
                        "Authorization": BCRM_BASIC_AUTH
                    },
                });
                if (typeof (qd.responseJSON) !== "undefined") {
                    if (typeof (qd.responseJSON["Comments"]) !== "undefined") {
                        ocom = qd.responseJSON["Comments"]
                        if (ocom.indexOf(icom) == -1) {
                            //comments do not include lizard tag
                            //not touched in this workspace today, let's touch it then
                            ncom = ocom + " | " + icom;
                            var cdata = JSON.stringify({
                                "Name": an,
                                "Comments": ncom
                            });
                            url = location.origin + "/siebel/v1.0/workspace/" + ws + "/Applet/" + an;
                            qd = $.ajax({
                                dataType: "json",
                                url: url,
                                async: false,
                                method: "PUT",
                                data: cdata,
                                headers: {
                                    "Authorization": BCRM_BASIC_AUTH,
                                    "Content-Type": "application/json"
                                },
                            });
                        }
                    }
                }

                //update List Columns
                lcols.forEach((newwidth, colname) => {
                    if (newwidth > 0) {
                        ucol["Name"] = colname;
                        ucol["HTML Width"] = newwidth.toString();
                        requestOptions = {
                            method: 'PUT',
                            headers: myHeaders,
                            body: JSON.stringify(ucol),
                            redirect: 'follow'
                        };
                        fetch(location.origin + "/siebel/v1.0/workspace/" + ws + "/Applet/" + an + "/List/List/List Column", requestOptions)
                            .then(response => response.text())
                            .then(result => {
                                console.log(colname + " updated");
                                $("input[colname='" + colname + "']").parent().css("background", "lightgreen");
                            })
                            .catch(error => console.log('error', error));
                    }
                });
            }
        }
    }
    else {
        SiebelApp.Utils.Alert("Workspace '" + ws + "' is not editable.");
    }
}
//Add Lizard button
BCRMAddLizardButton = function () {
    var btn = $('<div id="devpops_lizard" class="siebui-banner-btn"><ul class="siebui-toolbar" aria-label="devpops Lizard: Auto-resize List Columns"><li id="devpops_1" class="siebui-toolbar-enable" role="menuitem" title="devpops Lizard: Auto-resize List Columns" aria-label="devpops Lizard: Auto-resize List Columns" name="devpops Lizard: Auto-resize List Columns">🦎</li></ul></div>');
    if ($("#devpops_lizard").length == 0) {
        $("div#siebui-toolbar-settings").after(btn);
        btn.on("click", function () {
            let pm = SiebelApp.S_App.GetActiveView().GetActiveApplet().GetPModel();
            BCRMAutoResizeColumns(pm);
        })
    }
};

//Add History button
BCRMAddHistoryButton = function () {
    var btn = $('<div id="devpops_hist" class="siebui-banner-btn"><ul class="siebui-toolbar" aria-label="devpops: View Workspace History for active record"><li id="devpops_2" class="siebui-toolbar-enable" role="menuitem" title="devpops: View Workspace History for active record" aria-label="devpops: View Workspace History for active record" name="devpops: View Workspace History for active record">⏰</li></ul></div>');
    if ($("#devpops_hist").length == 0) {
        $("div#siebui-toolbar-settings").after(btn);
        btn.on("click", function () {
            let pm = SiebelApp.S_App.GetActiveView().GetActiveApplet().GetPModel();
            let ot = $(".siebui-wt-objexp-tree").find(".fancytree-active").text();
            let fn = "Name";
            if (ot == "Workflow Process") {
                fn = "Process Name";
            }
            var rn = pm.Get("GetRecordSet")[pm.Get("GetSelection")][fn];
            BCRMDisplayWSHistory(rn, ot);
        })
    }
};

//Add ChangeRecords button
BCRMAddChangeRecordsButton = function () {
    var btn = $('<div id="devpops_cr" class="siebui-banner-btn"><ul class="siebui-toolbar" aria-label="devpops: Change Records"><li id="devpops_3" class="siebui-toolbar-enable" role="menuitem" title="devpops: Change Records" aria-label="devpops: Change Records" name="devpops: Change Records">💿</li></ul></div>');
    if ($("#devpops_cr").length == 0) {
        $("div#siebui-toolbar-settings").after(btn);
        btn.off("click");
        btn.on("click", function () {
            var pm = SiebelApp.S_App.GetActiveView().GetActiveApplet().GetPModel();
            var rows = pm.Get("GetRowsSelectedArray");
            var title = pm.Get("GetTitle");
            var rs = 0;
            for (var i = 0; i < rows.length; i++) {
                if (rows[i]) {
                    rs++;
                }
            }
            var bc = pm.Get("GetBusComp");
            if (bc.IsNumRowsKnown()) {
                //probably selected all records (CTRL+A works in Web Tools)
                if (bc.GetNumRows() > rs) {
                    rs = bc.GetNumRows();
                }
            }
            var inf = $("<div>");
            inf.text(rs + " row" + (rs > 1 ? "s" : "") + " selected for " + title);
            var ic = 0;
            var i_one = setInterval(function () {
                ic++;
                if (ic > 5) {
                    //cannae do it cap'n
                    clearInterval(i_one);
                    inf = null;
                }
                var cm = SiebelAppFacade.ComponentMgr;
                if (cm.FindComponent("Change Records Popup Applet (SWE)") != null) {
                    clearInterval(i_one);
                    let cpm = cm.FindComponent("Change Records Popup Applet (SWE)").GetPM();
                    let cfi = cpm.Get("GetFullId");
                    let cae = $("#" + cfi);
                    cae.before(inf);
                }
            }, 600);
            pm.ExecuteMethod("InvokeMethod", "ChangeRecords");
        })
    }
};

//Enhance 3-applet views (with Form Applet on top)
BCRMAddFormNavigation = function () {
    var view = SiebelApp.S_App.GetActiveView();
    var am = view.GetAppletMap();
    var l = 0;
    var pm, pr, cs, fi, ae, nce;
    var prev, next;
    for (a in am) {
        l++;
    }
    if (l == 3) {
        for (a in am) {
            if (a.indexOf("Form Applet") > 0) {
                pm = am[a].GetPModel();
                break;
            }
        }
        if (typeof (pm.Get) === "function") {
            pr = pm.GetRenderer();
            cs = pm.Get("GetControls");
            fi = pm.Get("GetFullId");
            ae = $("#" + fi);
            nce = pr.GetUIWrapper(cs["Name"]).GetEl();
            if (ae.find(".bcrm-prev").length == 0) {
                prev = $("<div title='devpops: Go to previous record' class='bcrm-prev' style='position:relative;bottom:6px;cursor:pointer;font-size:1.2em;'>👈</div>");
                prev.on("click", function () {
                    pm.ExecuteMethod("InvokeMethod", "GotoPrevious");
                });
            }
            else {
                prev = ae.find(".bcrm-prev");
            }
            if (ae.find(".bcrm-next").length == 0) {
                next = $("<div title='devpops: Go to next record' class='bcrm-next' style='position:relative;bottom:6px;cursor:pointer;font-size:1.2em;'>👉</div>");
                next.on("click", function () {
                    pm.ExecuteMethod("InvokeMethod", "GotoNext");
                })
            }
            else {
                next = ae.find(".bcrm-next");
            }
            if (!pm.ExecuteMethod("CanInvokeMethod", "GotoPrevious")) {
                prev.hide();
            }
            else {
                prev.show();
            }
            if (!pm.ExecuteMethod("CanInvokeMethod", "GotoNext")) {
                next.hide();
            }
            else {
                next.show();
            }
            if (ae.find(".bcrm-prev").length == 0) {
                nce.before(prev);
            }
            if (ae.find(".bcrm-next").length == 0) {
                nce.after(next);
            }
            if (pm.Get("BCRM_FORMNAV") != "true") {
                pm.AddMethod("ShowSelection", BCRMAddFormNavigation, { sequence: false, scope: pm });
                pm.SetProperty("BCRM_FORMNAV", "true");
            }
        }
    }
};

//22.12 Features
//Enhance WS Dashboard
//TBD: Split into functions, for now we only have the object drilldown, so we're good
BCRMEnhanceWSDashboard = function (pm) {
    var row, cell, vn, ot;
    if (typeof (pm.Get) != "function") {
        pm = this;
    }
    if (typeof (pm.Get) === "function") {
        var rs = pm.Get("GetRawRecordSet");
        var fi = pm.Get("GetFullId");
        var ph = pm.Get("GetPlaceholder");
        var ae = $("#" + fi);
        if (rs.length > 0) {
            for (r in rs) {
                ot = rs[r]["Obj Type"];
                vn = "WT Repository " + ot + " List View";
                if (ot == "Screen") {
                    vn = "WT Repository Screen View List View";
                }
                row = parseInt(r) + 1;
                cell = ae.find("td[id='" + row + "_" + ph + "_Obj_Name']");
                cell.attr("bcrm-enhanced", "true");
                cell.css("color", "blue");
                cell.css("cursor", "pointer");
                cell.attr("title", "Left click: Navigate | Right click: Display Options");
                cell.attr("bcrm-view", vn);
                cell.attr("bcrm-rn", rs[r]["Obj Name"]);
                cell.attr("bcrm-ot", ot);
                //left click
                cell.off("click");
                cell.on("click", function () {
                    let bvn = $(this).attr("bcrm-view");
                    let rn = $(this).attr("bcrm-rn");
                    sessionStorage.BCRM_DBNAV_VIEW = bvn;
                    sessionStorage.BCRM_DBNAV_RN = rn;
                    sessionStorage.BCRM_DBNAV_GO = "yes";
                    console.log("BCRMEnhanceWSDashboard: Left-click WSDB navigation: go='yes', view=" + bvn);
                    //Close WS Dashboard, we will pick up on the other side
                    history.back();
                });
                cell.off("contextmenu");
                cell.on("contextmenu", function () {
                    let bvn = $(this).attr("bcrm-view");
                    let rn = $(this).attr("bcrm-rn");
                    let otype = $(this).attr("bcrm-ot");
                    sessionStorage.BCRM_DBNAV_VIEW = bvn;
                    sessionStorage.BCRM_DBNAV_RN = rn;
                    BCRMDisplayWSForObject(rn, otype, bvn);
                    return false;
                });
            }
        }
    }
};

//goto object demo
BCRMGotoObject = function (rn, ot) {
    var vn = "WT Repository " + ot + " List View";
    sessionStorage.BCRM_DBNAV_VIEW = vn;
    sessionStorage.BCRM_DBNAV_RN = rn;
    sessionStorage.BCRM_DBNAV_GO = "yes";
    var n = "";//"?SWECmd=GotoView&SWEView=" + vn.replaceAll(" ","+") + "&SkipBuildView=1&SWEC=4&SRN=&SWEKeepContext=1";
    n = "SWEKeepContext=1";
    //var r = "_sweclient._swecontent._sweview";
    SiebelApp.S_App.GotoView(vn, null, n);
};

//post Dashboard Navigation query
BCRMPostDBNavQuery = function (vn) {

    $("#maskoverlay").css("background", "rgb(128 128 128 / 25%)");
    $("#maskoverlay").show();

    setTimeout(function () { //1000
        var fn = "Name";
        var fnc = fn;
        if (vn == "WT Repository Workflow Process List View") {
            fn = "Process Name";
            fnc = "Process_Name";
        }

        //let's hope top list applet is always active
        var ap = SiebelApp.S_App.GetActiveView().GetActiveApplet();
        var apm = ap.GetPModel();
        var ph = apm.Get("GetPlaceholder");
        var fi = apm.Get("GetFullId");
        var cs = apm.Get("GetControls");
        var ae = $("#" + fi);
        var c = 1;

        ae.focus();

        if (!ap.IsInQueryMode()) {
            console.log("NewQuery 1");
            apm.ExecuteMethod("InvokeMethod", "NewQuery");
        }

        setTimeout(function () { //200
            //wait for applet to be ready
            var navid = setInterval(function () { // 200*5
                if (c > 5) {
                    clearInterval(navid);
                    //no cigar
                    sessionStorage.BCRM_DBNAV_VIEW = "";
                    SiebelApp.Utils.Alert("Well, that's embarassing but we messed up. Please try again.\n(devpops-BCRMPostDBNavQuery)");
                }
                console.log("BCRMPostDBNavQuery: interval " + c);
                c++;
                //look for jqgrid/scroll table (good indicator for a healthy applet)
                //if (ae.find("table#" + ph + ".ui-jqgrid-btable").length > 0) {
                if (ae.find("#" + ph + "_scroll").length > 0) {
                    console.log("found table");
                    if (!ap.IsInQueryMode()) {
                        console.log("NewQuery 2");
                        apm.ExecuteMethod("InvokeMethod", "NewQuery");
                    }
                    if (true) {
                        console.log("Applet ready to query");
                        clearInterval(navid);
                        setTimeout(function () { //100
                            //run query
                            console.log("set control value");
                            //safer query in Project Name column (if for whatever reason it sets the field value it will error out)
                            apm.OnControlEvent(consts.get("PHYEVENT_CONTROL_FOCUS"), cs["Project Name"]);
                            apm.OnControlEvent(consts.get("PHYEVENT_CONTROL_BLUR"), cs["Project Name"], "[" + fn + "]='" + sessionStorage.BCRM_DBNAV_RN + "'");

                            console.log("ExecuteQuery");
                            apm.ExecuteMethod("InvokeMethod", "ExecuteQuery");
                            $("#maskoverlay").hide();
                            sessionStorage.BCRM_DBNAV_VIEW = "";

                            //select the Changed Flag to avoid accidents with writeable workspaces
                            console.log("select Changed flag");
                            ae.find("#1_" + ph + "_Changed").focus();
                            ae.find("#1_" + ph + "_Changed").click();

                            //expand Object Explorer
                            var exp = $(".siebui-wt-objexp-tree").find(".fancytree-active").find(".fancytree-expander");
                            if (!exp.parent().hasClass("fancytree-expanded")) {
                                exp.click();
                            }

                            //example post-nav action
                            //TBD: use external var etc
                            console.log("execute post-nav action");
                            if (apm.Get("GetRecordSet").length > 0) {
                                setTimeout(function () { //100
                                    if (vn == "WT Repository Workflow Process List View") {
                                        $("button.siebui-icon-gotoview")[0].click();
                                    }
                                    if (vn == "WT Repository Task List View") {
                                        $("button.siebui-icon-gotoview")[0].click();
                                    }
                                    if (vn == "WT Repository Integration Object List View") {
                                        SiebelApp.S_App.GotoView("WT Repository Integration Component List View", null, "SWEKeepContext=1");
                                    }
                                    if (vn == "WT Repository Business Service List View") {
                                        var cl = apm.Get("GetRecordSet")[0]["Class"];
                                        if (cl == "CSSService" || cl == "CSSEAIDTEScriptService") {
                                            var svc = SiebelApp.S_App.GetService("Script Editor UI Service");
                                            var ips = SiebelApp.S_App.NewPropertySet();
                                            var ops = svc.InvokeMethod("Edit Server Scripts", ips);
                                        }
                                        else {
                                            SiebelApp.S_App.GotoView("WT Repository Business Service Method Arg List View", null, "SWEKeepContext=1");
                                        }
                                    }
                                    if (vn == "WT Repository View List View") {
                                        SiebelApp.S_App.GotoView("WT Repository View Web Template List View", null, "SWEKeepContext=1");
                                        setTimeout(function () {
                                            $("button.siebui-icon-gotoview")[0].click();
                                        }, 200);
                                    }
                                    if (vn == "WT Repository Applet List View") {
                                        if (sessionStorage.BCRM_DBNAV_RN.indexOf("List") > -1) {
                                            SiebelApp.S_App.GotoView("WT Repository List Column List View", null, "SWEKeepContext=1");
                                        }
                                        else {
                                            SiebelApp.S_App.GotoView("WT Repository Control List View", null, "SWEKeepContext=1");
                                        }
                                    }
                                    if (vn == "WT Repository Web Template List View") {
                                        SiebelApp.S_App.GotoView("WT Repository Object Design List View", null, "SWEKeepContext=1");
                                    }
                                }, 100);
                            }
                        }, 100);
                    }
                }
            }, 200);
        }, 200);
    }, 1000);

};

//Workspace Intel
//Vanilla business service to the rescue
BCRMGetWSContext = function () {
    try {
        var svwecp = SiebelApp.S_App.GetService("Web Engine Client Preferences");
        var ip = SiebelApp.S_App.NewPropertySet();
        if (typeof (svwecp.InvokeMethod) === "function") {
            var op = svwecp.InvokeMethod("GetActiveWSContext", ip);
            if (typeof (op) !== "undefined") {
                op = op.GetChildByType("ResultSet");
                sessionStorage.BCRMCurrentWorkspaceVersion = op.GetProperty("WSVersion");
                sessionStorage.BCRMCurrentWorkspace = op.GetProperty("WSName");
                sessionStorage.BCRMCurrentWorkspaceStatus = op.GetProperty("ActiveWSStatus");
                if (SiebelApp.S_App.GetAppName() != "Siebel Web Tools") {
                    BCRMWSUpdateWSBanner(sessionStorage.BCRMCurrentWorkspace, sessionStorage.BCRMCurrentWorkspaceVersion, sessionStorage.BCRMCurrentWorkspaceStatus);
                }
            }
        }
    }
    catch (e) {
        console.log("Error in BCRMGetWSContext: " + e.toString());
    }
};

//WSUI Dashboard: Get Current Selection
BCRMWSDBGetCurrentSelection = function () {
    var vn = SiebelApp.S_App.GetActiveView().GetName();
    var retval;
    if (vn == "WSUI Dashboard View") {
        var wslpm = SiebelApp.S_App.GetActiveView().GetApplet("WSUI Dashboard - All Workspaces List Applet").GetPModel();
        var wsvpm = SiebelApp.S_App.GetActiveView().GetApplet("WSUI Dashboard - Versions Applet").GetPModel();
        var selwsn = wslpm.Get("GetRecordSet")[wslpm.Get("GetSelection")]["Calc Name Status"].split(" ")[0];
        var selwsv = wsvpm.Get("GetRecordSet")[wsvpm.Get("GetSelection")]["Ver Num"];
    }
    retval = selwsn + "/" + selwsv;
    return retval;
}

//Workspace Actions
BCRMWorkspaceAction = function (action) {
    var svc = SiebelApp.S_App.GetService("Web Engine Client Preferences");
    var ips = SiebelApp.S_App.NewPropertySet();
    sessionStorage.BCRM_DBNAV_WSACTION = action;
    svc.InvokeMethod(action, ips);
};

//get all workspaces for a given object
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMWSGetWSForObject = function (rn, ot, searchspec) {
    var response;
    var retval;
    //get only Edit-In-Progress workspaces by default
    if (typeof (searchspec) === "undefined") {
        searchspec = "[Workspace Editable Flag]='Y'";
    }
    var url = location.origin + "/siebel/v1.0/data/BCRM Modified Object/BCRM Modified Object" + "?uniformresponse=Y&PageSize=100&searchspec=" + "[Object Name]=\"" + rn + "\" AND [Object Type]=\"" + ot + "\"" + " AND " + searchspec;
    var settings = {
        "url": url,
        "method": "GET",
        "async": false,
        "timeout": 0,
        "headers": {
            //"Authorization": "Basic U0FETUlOOlNpZWJlbDE5"
        },
    };

    response = $.ajax(settings);
    if (response.status == 200) {
        retval = response;
    }
    return retval;
};

//get objects for a given workspace
//demo: pagination in REST
BCRMGetObjectsForWS = function (ws, ver) {
    var oresponse, objdata, oitems, links;
    var items = [];
    var srn = 0;
    var hasnext = false;
    var url = location.origin + "/siebel/v1.0/data/BCRM Modified Object/BCRM Modified Object" + "?uniformresponse=Y&PageSize=100&pagination=Y&StartRowNum=" + srn + "&searchspec=" + "[Workspace Name]=\"" + ws + "\" AND [Workspace Version]=\"" + ver + "\"" + "&sortspec=Object Type,Object Name";
    var settings = {
        "url": url,
        "method": "GET",
        "async": false,
        "timeout": 0,
        "headers": {
            //"Authorization": "Basic U0FETUlOOlNpZWJlbDE5"
        },
    };
    do {
        oresponse = $.ajax(settings);
        if (oresponse.status == 200) {
            objdata = oresponse;
            oitems = objdata.responseJSON.items;
            items = [...items, ...oitems];
            links = objdata.responseJSON.Link;
            for (l in links) {
                if (links[l].rel == "nextSet") {
                    hasnext = true;
                    srn = srn + 100;
                    settings.url = location.origin + "/siebel/v1.0/data/BCRM Modified Object/BCRM Modified Object" + "?uniformresponse=Y&PageSize=100&pagination=Y&StartRowNum=" + srn + "&searchspec=" + "[Workspace Name]=\"" + ws + "\" AND [Workspace Version]=\"" + ver + "\"" + "&sortspec=Object Type,Object Name";
                    break;
                }
                else {
                    hasnext = false;
                }
            }
        }
    } while (hasnext);
    return items;
};

BCRMDisplayObjectsForWS = function (ws, ver) {
    if (typeof (ws) === "undefined") {
        BCRMGetWSContext();
        ws = sessionStorage.BCRMCurrentWorkspace;
        ver = sessionStorage.BCRMCurrentWorkspaceVersion;
    }
    var wss;
    var data = BCRMGetObjectsForWS(ws, ver);
    if (typeof (data) !== "undefined") {
        var dlg = $("<div>");
        var c = $("<div id='bcrm_wslist' style='overflow:auto;height:200px'>");
        var f = $("<div><input placeholder='type to search' style='margin: 2px; font-size: 14px; padding: 2px; width:70%;' id='bcrm_filter'></div>");
        f.find("input").on("keyup", function () {
            var value = $(this).val();
            $("#bcrm_wslist div").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value.toLowerCase()) > -1)
            });
        });
        var inf = $("<div style='font-weight:bold; font-size:1.3em;'></div>");

        for (var i = 0; i < data.length; i++) {
            if (typeof (wss) === "undefined") {
                wss = data[i]["Workspace Status"];
            }
            var dc = $("<div style='cursor:pointer;font-size:1.2em;padding-bottom: 2px;'>");
            var ot = data[i]["Object Type"];
            var rn = data[i]["Object Name"];
            var oper = data[i]["Operation"];
            dc.attr("bcrm-rn", rn);
            dc.attr("bcrm-ot", ot);
            dc.attr("bcrm-view", "WT Repository " + ot + " List View");
            if (SiebelApp.S_App.GetAppName() == "Siebel Web Tools") {
                dc.attr("title", "Go to " + ot + ": " + rn);
            }
            else {
                dc.attr("title", "Open " + ot + ": " + rn + " in Web Tools");
                if (ot == "View") {
                    dc.attr("title", dc.attr("title") + "\nRight-click: Go to View");
                    dc.on("contextmenu", function () {
                        let rn = $(this).attr("bcrm-rn");
                        $(this).parent().find("[bcrm-active='yes']").css("border", "none");
                        $(this).parent().find("[bcrm-active='yes']").attr("bcrm-active", "");
                        $(this).attr("bcrm-active", "yes");
                        $(this).css("border", "4px solid green");
                        SiebelApp.S_App.GotoView(rn);
                        return false;
                    });
                }
            }

            dc.text((typeof (icon_map.get(ot)) === "undefined" ? "🚀" : icon_map.get(ot)) + " " + ot + ": " + rn + " (" + oper + ")");

            dc.on("click", function () {
                $(this).parent().find("[bcrm-active='yes']").css("border", "none");
                $(this).parent().find("[bcrm-active='yes']").attr("bcrm-active", "");
                $(this).attr("bcrm-active", "yes");
                $(this).css("border", "4px solid green");
                let bvn = $(this).attr("bcrm-view");
                let ot = $(this).attr("bcrm-ot");
                let rn = $(this).attr("bcrm-rn");
                if (SiebelApp.S_App.GetAppName() == "Siebel Web Tools") {
                    sessionStorage.BCRM_DBNAV_VIEW = bvn;
                    sessionStorage.BCRM_DBNAV_RN = rn;
                    if (SiebelApp.S_App.GetActiveView().GetName() != bvn) {
                        sessionStorage.BCRM_DBNAV_GO = "yes";
                        SiebelApp.S_App.GotoView(bvn);
                    }
                    else {
                        BCRMPostDBNavQuery(bvn);
                    }
                }
                else {
                    BCRMOpenWebTools(ws, ver, rn, ot);
                }
            })
            c.append(dc);
        }
        inf.text("Workspace: " + ws + "/" + ver + " (" + wss + ")");
        dlg.append(inf);
        dlg.append(f);
        dlg.append(c);
        dlg.dialog({
            title: "Modified Objects",
            width: 700,
            height: 400,
            classes: {
                "ui-dialog": "bcrm-dialog"
            },
            buttons: {
                Close: function (e, ui) {
                    $(this).dialog("destroy");
                }
            }
        })
    }
};

BCRMWSGetWSHistoryForObject = function (rn, ot, searchspec) {
    var oresponse, mresponse, aresponse;
    var objdata;
    var mrgdata;
    var attdata;
    var d = {};
    //get all workspaces by default
    if (typeof (searchspec) === "undefined") {
        searchspec = "[Workspace Editable Flag]<>'x'";
    }
    var url = location.origin + "/siebel/v1.0/data/BCRM Modified Object/BCRM Modified Object" + "?uniformresponse=Y&PageSize=100&searchspec=" + "[Object Name]=\"" + rn + "\" AND [Object Type]=\"" + ot + "\"" + " AND " + searchspec;
    var settings = {
        "url": url,
        "method": "GET",
        "async": false,
        "timeout": 0,
        "headers": {
            //"Authorization": "Basic U0FETUlOOlNpZWJlbDE5"
        },
    };

    oresponse = $.ajax(settings);

    if (oresponse.status == 200) {
        objdata = oresponse;
        var items = objdata.responseJSON.items;
        for (i = 0; i < items.length; i++) {
            var oname = items[i]["Workspace Name"] + "/" + items[i]["Workspace Version"];
            d[oname] = {};
            var ws = d[oname];
            if (typeof (items[i]["Updated"]) !== "undefined") {
                ws["Date"] = items[i]["Updated"];
            }
            ws["WS Version"] = items[i]["Workspace Version"];
            ws["Comments"] = items[i]["Version Comments"];
            ws["User"] = items[i]["User Name"];
            var status = items[i]["Workspace Status"];
            var oper = items[i]["Operation"];
            ws["WS Status"] = status;
            ws["Operation"] = oper;
            if (oper == "Update" && status == "Delivered") {
                //get merge object list
                settings.url = items[i]["Link"][2]["href"] + "?uniformresponse=Y";
                mresponse = $.ajax(settings);
                if (mresponse.status == 200) {
                    mrgdata = mresponse;
                    var mitems = mrgdata.responseJSON.items;
                    for (j = 0; j < mitems.length; j++) {
                        var mname = "OBJECT: " + mitems[j]["Object Path"] + " - " + (parseInt(j) + 1);
                        ws[mname] = {};
                        var ms = ws[mname];
                        ms["Status"] = mitems[j]["Status"];
                        var conflict = mitems[j]["Property Level Conflict Flag"];
                        ms["Property Conflict"] = conflict;
                        if (typeof (mitems[j]["Updated"]) !== "undefined") {
                            ms["Date"] = mitems[j]["Updated"];
                        }
                        if (conflict == "Y") {
                            //get attribute level diffs
                            settings.url = mitems[j]["Link"][3]["href"] + "?uniformresponse=Y";;
                            aresponse = $.ajax(settings);
                            if (aresponse.status == 200) {
                                attdata = aresponse;
                                var aitems = attdata.responseJSON.items;
                                for (k = 0; k < aitems.length; k++) {
                                    var aname = "PROPERTY: " + aitems[k]["Property Name"]
                                    ms[aname] = {};
                                    var ps = ms[aname];
                                    //ps["Property"] = aitems[k]["Property Name"];
                                    ps["Old Std"] = aitems[k]["Old Std Value"];
                                    ps["New Std"] = aitems[k]["New Std Value"];
                                    ps["Old Cust"] = aitems[k]["Old Cust Value"];
                                    ps["Resolution"] = aitems[k]["Resolution"];
                                    ps["Conflict"] = aitems[k]["Conflict Flag"];
                                    ps["Override"] = aitems[k]["Override Flag"];
                                    if (typeof (aitems[k]["Updated"]) !== "undefined") {
                                        ps["Date"] = aitems[k]["Updated"];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return d;
};

//Display workspaces for a given object
BCRMDisplayWSForObject = function (rn, ot, bvn) {
    var curws = BCRMWSDBGetCurrentSelection();
    BCRMGetWSContext();
    var ows = sessionStorage.BCRMCurrentWorkspace + "/" + sessionStorage.BCRMCurrentWorkspaceVersion;
    var wss = [];
    wss.push(ows + " (currently open)");
    if (ows != curws) {
        wss.push(curws + " (selected)");
    }

    var data = BCRMWSGetWSForObject(rn, ot, "[Workspace Editable Flag]<>'x'");
    if (typeof (data) !== "undefined") {
        var items = data.responseJSON.items;
        for (i = 0; i < items.length; i++) {
            var aws = items[i]["Workspace Name"] + "/" + items[i]["Workspace Version"];
            if (aws == ows || aws == curws) {
                //do not insert again
            }
            else {
                wss.push(aws + " (" + items[i]["Workspace Status"] + ")");
            }
        }
    }
    var dlg = $("<div>");
    var c = $("<div id='bcrm_wslist' style='overflow:auto;height:200px;'>");
    var inf = $("<div style='font-size: 1.2em;'>");
    inf.text(ot + ": " + rn);
    var f = $("<input placeholder='type to search' style='margin: 2px; font-size: 14px; padding: 2px; width:70%;' id='bcrm_filter'><br>");
    f.on("keyup", function () {
        var value = $(this).val();
        $("#bcrm_wslist div").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value.toLowerCase()) > -1)
        });
    });


    for (j = 0; j < wss.length; j++) {
        var d = $("<div><input type='radio' name='wss' id='r_" + j + "' value='" + wss[j] + "'><label for='r_" + j + "'>" + wss[j] + "</label></div>");
        if (ows == curws) {
            if (j == 0) {
                d.find("input").attr("checked", "checked");
            }
        }
        else {
            if (j == 1) {
                d.find("input").attr("checked", "checked");
            }
        }
        c.append(d);
    }

    dlg.append(inf);
    dlg.append(f);
    dlg.append(c);

    dlg.dialog({
        title: "Select Workspace",
        width: 500,
        height: 400,
        classes: {
            "ui-dialog": "bcrm-dialog"
        },
        buttons: {
            Go: function (e, ui) {
                var dlg = $(this);
                var wsval = dlg.dialog().find("input:checked").val();
                ws = wsval.split(" (")[0];
                wsst = wsval.split(" (")[1];
                if (ows == ws) {
                    sessionStorage.BCRM_DBNAV_GO = "yes";
                    console.log("BCRMDisplayWSForObject: dialog/ws match: go='yes', view=" + bvn);
                    history.back();
                }
                else {
                    var wsn = ws.split("/")[0];
                    var wsv = ws.split("/")[1];
                    var owsn = ows.split("/")[0];
                    var owsv = ows.split("/")[1];
                    if (wsst != "selected)") {
                        BCRMQueryWSList(wsn, wsn, wsv);
                    }
                    else {
                        if (wsn == owsn && wsv != owsv) {
                            BCRMQueryWSList(wsn, wsn, wsv);
                        }
                    }
                    sessionStorage.BCRM_DBNAV_GO = "open";
                    console.log("BCRMDisplayWSForObject: dialog/no ws match: go='open', view=" + bvn);
                    //most of the time, opening a workspace reloads (re-navigates) the dashboard...
                    BCRMWorkspaceAction("Open");
                    //...but not always...
                    var r = true;
                    setTimeout(function () {
                        //...if we are still in WS Dashboard, close it (initiates post-nav query)
                        if (r && SiebelApp.S_App.GetActiveView().GetName() == "WSUI Dashboard View") {
                            sessionStorage.BCRM_DBNAV_GO = "yes";
                            console.log("BCRMDisplayWSForObject: still in WS dashboard, leaving now");
                            $(".ui-dialog-content").dialog("close");
                            history.back();
                        }
                    }, 2000);
                }
                dlg.dialog("destroy");
            },
            Select: function (e, ui) {
                var wsval = $(this).dialog().find("input:checked").val();
                var ws = wsval.split(" (")[0];
                var wsn = ws.split("/")[0];
                var wsv = ws.split("/")[1];
                BCRMQueryWSList(wsn, wsn, wsv, rn, ot);
                $(this).dialog("destroy");
                BCRMDisplayWSForObject(rn, ot, bvn);
            },
            Close: function (e, ui) {
                $(this).dialog("destroy");
            }
        }
    });
};

BCRMDisplayWSHistory = function (rn, ot) {
    var data = BCRMWSGetWSHistoryForObject(rn, ot);
    var dlg = $("<div id='bcrm_wslist' style='overflow-y: auto;'>");
    var itext = ot + ": " + rn;
    var inf1 = $("<div style='font-size:1.5em;'>" + itext + "</div>");
    var f = $("<input placeholder='type to search' style='margin: 2px; font-size: 14px; padding: 2px; width:70%;' id='bcrm_filter'><br>");
    f.on("keyup", function () {
        var value = $(this).val();
        $("#bcrm_wslist div").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value.toLowerCase()) > -1)
        });
    });

    //add currently open WS if not in data
    BCRMGetWSContext();
    var currws = sessionStorage.BCRMCurrentWorkspace + "/" + sessionStorage.BCRMCurrentWorkspaceVersion;
    var currws_in_data = false;
    for (wsv in data) {
        if (wsv == currws) {
            currws_in_data = true;
            break;
        }
    }
    if (!currws_in_data) {
        data[currws] = {
            "Operation": "OPEN",
            "Date": new Date().toLocaleString(),
            "User": SiebelApp.S_App.GetUserName(),
            "WS Status": "loaded",
            "Comments": "Workspace currently open"
        }
    }
    var c1 = 1;
    for (wsv in data) {
        var wsvc = $("<div class='bcrm-wsvc' id='wsvc_" + c1 + "' style='margin:4px;'></div>");
        c1++;
        var ws = data[wsv];
        var wsname = wsv.split("/")[0];
        var wsver = wsv.split("/")[1];
        wsvc.attr("bcrm-wsn", wsname);
        wsvc.attr("bcrm-wsv", wsver);
        wsvc.on("click", function () {
            $(".bcrm-wsvc").attr("bcrm-selected", "");
            $(".bcrm-wsvc").css("border", "none");
            $(this).attr("bcrm-selected", "true");
            $(this).css("border", "4px solid green");
        });
        var hd = $("<div style='width:100%;color:#29303f;padding-left:4px;background:linen;font-weight:bold!important;font-size:1.2em!important;'>" + wsv + " - " + ws["Operation"] + " (" + ws["Date"] + ")" + "</div>");
        wsvc.append(hd);
        var wsvd = $("<div style='display:flex'></div>");
        wsvd.append("<div style='padding-right:4px;'>" + ws["User"] + "</div>");
        wsvd.append("<div>" + ws["WS Status"] + " (" + ws["Comments"] + ")" + "</div>");

        wsvc.append(wsvd);

        //look for child records (Merged Objects)
        for (c in ws) {
            if (c.indexOf("OBJECT") == 0) {
                var ch = ws[c];
                var chd = $("<div style='padding-left:4px; padding-bottom:2px; border-top:1px solid darkgrey'></div>");
                chd.append("<div style='background: lightgoldenrodyellow;color:#29303f;font-size:1.1em;padding-left:4px;'>" + c + "</div>");
                if (typeof (ch["Date"]) !== "undefined") {
                    chd.append("<div>" + ch["Date"] + "</div>");
                }
                chd.append("<div>" + ch["Status"] + "</div>");
                wsvc.append(chd);

                //look for grandchildren (Properties)
                for (gc in ch) {
                    if (gc.indexOf("PROPERTY") == 0 && gc.indexOf("Placeholder") == -1) {
                        var gch = ch[gc];
                        var gchd = $("<div style='padding-left:10px; padding-bottom:2px;'></div>");
                        gchd.append("<div style='border-top: 1px solid lightgrey;'>" + gc + "</div>");
                        if (typeof (gch["Date"]) !== "undefined") {
                            gchd.append("<div>" + gch["Date"] + "</div>");
                        }
                        var res = gch["Resolution"];
                        var oval = gch["Old Std"];
                        if (ot == "Web Template" && gc == "PROPERTY: Definition") {
                            oval = oval.replaceAll("<", "&lt;");
                            oval = oval.replaceAll(">", "&gt;");
                            oval = "<pre>" + oval + "</pre>";
                        }
                        if (gc == "PROPERTY: Script") {
                            oval = "<pre>" + oval + "</pre>";
                        }
                        gchd.append("<div>" + "Old Value: " + oval + "</div>");
                        var nval = "";
                        if (res == "Use Custom Value") {
                            nval = gch["Old Cust"];
                        }
                        else {
                            nval = gch["New Std"];
                        }
                        if (ot == "Web Template" && gc == "PROPERTY: Definition") {
                            nval = nval.replaceAll("<", "&lt;");
                            nval = nval.replaceAll(">", "&gt;");
                            nval = "<pre>" + nval + "</pre>";
                        }
                        if (gc == "PROPERTY: Script") {
                            nval = "<pre>" + nval + "</pre>";
                        }
                        gchd.append("<div>" + "New Value: " + nval + "</div>");
                        wsvc.append(gchd);
                    }
                }
            }
        }
        //open WS first
        if (ws["Operation"] == "OPEN") {
            dlg.prepend(wsvc);
        }
        else {
            dlg.append(wsvc);
        }

        //header
        dlg.prepend(f);
        dlg.prepend(inf1);

    }

    var btns = {};
    if (SiebelApp.S_App.GetAppName() != "Siebel Web Tools") {
        btns["Fast Inspect"] = function (e, ui) {
            let sel = $(this).dialog().find("[bcrm-selected='true']");
            let wsn = sel.attr("bcrm-wsn");
            let wsv = sel.attr("bcrm-wsv");
            BCRMWSFastInspect(wsn, wsv);
            $(this).dialog("destroy");
        };
        btns["Open in Web Tools"] = function (e, ui) {
            let sel = $(this).dialog().find("[bcrm-selected='true']");
            let wsn = sel.attr("bcrm-wsn");
            let wsv = sel.attr("bcrm-wsv");
            BCRMOpenWebTools(wsn, wsv, rn, ot);
            //$(this).dialog("destroy");
        };
    }
    btns["Close"] = function (e, ui) {
        $(this).dialog("destroy");
    }
    dlg.dialog({
        title: "Workspace History",
        width: 800,
        height: 500,
        classes: {
            "ui-dialog": "bcrm-dialog"
        },
        buttons: btns
    });

};

//locate ws/version in WS Dashboard
BCRMQueryWSList = function (searchspec, select, v, rn, ot) {
    var view = SiebelApp.S_App.GetActiveView();
    if (view.GetName() == "WSUI Dashboard View") {
        var pm = view.GetApplet("WSUI Dashboard - All Workspaces List Applet").GetPModel();
        var cs = pm.Get("GetControls");
        pm.OnControlEvent(consts.get("PHYEVENT_CONTROL_FOCUS"), cs["QuerySrchSpec"]);
        pm.OnControlEvent(consts.get("PHYEVENT_CONTROL_BLUR"), cs["QuerySrchSpec"], searchspec);
        pm.ExecuteMethod("InvokeMethod", "Find");
        if (typeof (select) !== "undefined") {
            var rs = pm.Get("GetRecordSet");
            for (r in rs) {
                if (rs[r]["Calc Name Status"].indexOf(select) == 0) {
                    pm.ExecuteMethod("HandleRowSelect", r);
                    break;
                }
            }
            if (typeof (v) !== "undefined") {
                //Versions applet is weird, have to "scroll" until version is found
                var vpm = view.GetApplet("WSUI Dashboard - Versions Applet").GetPModel();
                var vrs;
                var v_found = false;
                if (vpm.ExecuteMethod("CanInvokeMethod", "GotoFirstSet")) {
                    vpm.ExecuteMethod("InvokeMethod", "GotoFirstSet");
                }
                do {
                    vrs = vpm.Get("GetRecordSet");
                    for (vr in vrs) {
                        if (vrs[vr]["Ver Num"] == v) {
                            v_found = true;
                            vpm.ExecuteMethod("HandleRowSelect", vr);
                            break;
                        }
                    }
                    if (!v_found) {
                        vpm.ExecuteMethod("InvokeMethod", "GotoNextSet");
                    }
                } while (!v_found);
            }
            if (typeof (rn) !== "undefined") {
                //Select the object, same weird applet kind of applet
                var opm = view.GetApplet("WSUI Dashboard - Objects List Applet").GetPModel();
                var ors;
                var o_found = false;
                if (opm.ExecuteMethod("CanInvokeMethod", "GotoFirstSet")) {
                    opm.ExecuteMethod("InvokeMethod", "GotoFirstSet");
                }
                do {
                    ors = opm.Get("GetRecordSet");
                    for (or in ors) {
                        if (ors[or]["Obj Name"] == rn && ors[or]["Obj Type"] == ot) {
                            o_found = true;
                            opm.ExecuteMethod("HandleRowSelect", or);
                            break;
                        }
                    }
                    if (!o_found) {
                        if (opm.ExecuteMethod("CanInvokeMethod", "GotoNextSet")) {
                            opm.ExecuteMethod("InvokeMethod", "GotoNextSet");
                        }
                        else {
                            //record not found (this happens)
                            o_found = true; //end loop
                        }
                    }
                } while (!o_found);
            }
        }
    }
};

//add "drilldown"
BCRMAddDrilldown = function () {
    var vn = SiebelApp.S_App.GetActiveView().GetName();
    var dd = {
        "WT Repository Business Service Method Arg List View": {
            "applet": "WT Repository Business Service Method Arg List Applet",
            "drilldowns": ["Integration Object"]
        }
    }
    var row, cell, fn, cn;
    for (v in dd) {
        if (v == vn) {
            var pm = SiebelApp.S_App.GetActiveView().GetApplet(dd[v]["applet"]).GetPModel();
            var rs = pm.Get("GetRecordSet");
            var fi = pm.Get("GetFullId");
            var ph = pm.Get("GetPlaceholder");
            if (pm.Get("BCRM_ADD_DRILLDOWN") != "true") {
                pm.AddMethod("ShowSelection", BCRMAddDrilldown, { sequence: true, scope: pm });
                pm.SetProperty("BCRM_ADD_DRILLDOWN", "true");
            }
            var ae = $("#" + fi);
            if (rs.length > 0) {
                for (r in rs) {
                    var ds = dd[v]["drilldowns"];
                    for (var i = 0; i < ds.length; i++) {
                        fn = ds[i];
                        if (rs[r][fn] != "") {
                            cn = fn.replaceAll(" ", "_");
                            row = parseInt(r) + 1;
                            cell = ae.find("td[id='" + row + "_" + ph + "_" + cn + "']");
                            cell.attr("bcrm-enhanced", "true");
                            cell.css("color", "blue");
                            cell.css("cursor", "pointer");
                            cell.attr("title", "Drilldown sponsored by devpops");
                            cell.attr("bcrm-ot", fn);
                            cell.attr("bcrm-rn", rs[r][fn]);
                            cell.on("click", function () {
                                let ot = $(this).attr("bcrm-ot");
                                let rn = $(this).attr("bcrm-rn");
                                BCRMGotoObject(rn, ot);
                            });
                        }
                    }
                }
            }
        }
    }
};

//Enhance WF Editor
BCRMEnhanceWFEditor = function () {
    try {
        var canvas = $("div.siebui-ide-canvas");
        if (canvas.length > 0) {
            //set title
            var fpm = SiebelApp.S_App.GetActiveView().GetApplet("WT Repository Workflow Process Form Applet").GetPModel();
            var tt = fpm.Get("GetRecordSet")[0]["RootObjectName"];

            //enhance Business Service steps
            canvas.find("div[data-type='TASK']").each(function (x) {
                //first click reads props and enhances the step div
                $(this).on("click", function (e, ui) {
                    var that = $(this);
                    setTimeout(function () {
                        if (that.attr("bcrm-enhanced") != "true") {
                            var propspm = SiebelApp.S_App.GetActiveView().GetApplet("WT Repository WF Step Properties Applet").GetPModel();
                            var props = propspm.Get("GetRecordSet");
                            var bs = props[0]["Business Service Name"];
                            var m = props[0]["Business Service Method"];
                            that.attr("bcrm-enhanced", "true");
                            that.attr("bcrm-bs", bs);
                            that.attr("bcrm-m", m);
                            that.attr("title", "Business Service/Method: [" + bs + "/" + m + "]\nRight-Click to preview code\nDouble-click to open");

                            //right-click to preview code in debugger
                            that.on("contextmenu", function () {
                                BCRMOpenScriptDebugger(bs, "Business Service");
                                return false;
                            });
                            //double-click to open
                            that.on("dblclick", function () {
                                BCRMGotoObject(bs, "Business Service");
                            });
                            //a dash of colour
                            that.find("polygon").css({
                                "fill": "greenyellow",
                                "stroke": "green",
                                "stroke-width": "3"
                            });
                        }
                    }, 200);
                })
            })
        }
    }
    catch (e) {
        console.log("BCRMEnhanceWFEditor: Error: " + e.toString());
    }
};

//Open Script Debugger (and load an object)
BCRMOpenScriptDebugger = function (rn, ot, m) {
    try {
        if ($("#_swescriptdebugger:visible").length == 0) {
            $("li[name='Toggle Script Debugger']").click();
        }
        BCRMInjectCSS("bcrm-begone", ".siebui-sd-select-script-obj-dialog, ul.siebui-sd-script-obj-type-list{z-index:-1!important;}");
        var i_one = setInterval(function () {
            if ($("#_swescriptdebugger:visible").length > 0) {
                clearInterval(i_one);
                $("#scriptDebuggerServerScriptObjType_icon").click();
                setTimeout(function () {
                    $("ul.siebui-sd-script-obj-type-list").find("li").each(function () {
                        if ($(this).text() == ot) {
                            $(this).click();
                        }
                    })
                    $("#scriptDebuggerServerScriptObjName_icon").click();
                    var i_two = setInterval(function () {
                        if ($(".siebui-sd-select-script-obj-content:visible").length > 0) {
                            clearInterval(i_two);
                            var pa = $(".siebui-sd-select-script-obj-content:visible");
                            pa.find("button.siebui-icon-newquery").click();
                            var i_three = setInterval(function () {
                                if (pa.find("button.siebui-icon-executequery:visible").length > 0) {
                                    clearInterval(i_three);
                                    var i_four = setInterval(function () {
                                        if (pa.find("input[name='Name']").length > 0) {
                                            clearInterval(i_four);
                                            pa.find("input[name='Name']").focus();
                                            pa.find("input[name='Name']").val("='" + rn + "'");
                                            setTimeout(function () {
                                                pa.find("button.siebui-icon-executequery").click();
                                                var i_five = setInterval(function () {
                                                    if (pa.parent().find("button.siebui-icon-pickrecord.appletButtonDis").length == 0) {
                                                        clearInterval(i_five);
                                                        pa.parent().find("button.siebui-icon-pickrecord").click();
                                                        var i_six = setInterval(function () {
                                                            BCRMUnInjectCSS("bcrm-begone");
                                                            if ($("#scriptDebuggerServerScriptObjName").val() == rn) {
                                                                clearInterval(i_six);
                                                                if (typeof (m) === "undefined") {
                                                                    m = "";
                                                                    if (ot == "Business Service") {
                                                                        m = "Service_PreInvokeMethod";
                                                                    }
                                                                }
                                                                $("#ScriptDebuggerEditorTree").find("span.fancytree-title").each(function () {
                                                                    if ($(this).text() == m) {
                                                                        $(this).click();
                                                                    }
                                                                });
                                                            }
                                                        }, 500);
                                                    }
                                                }, 200);
                                            }, 200);
                                        }
                                    }, 200);
                                }
                            }, 200);
                        }
                    }, 200);
                }, 100);
            }
        }, 200);
    }
    catch (e) {
        console.log("BCRMOpenScriptDebugger: Error: " + e.toString());
    }
};

//Add Buttons
BCRMMoarButtons = function () {
    try {
        //Edit Server Script button to all applets (Applet, Application, Business Component, Business Service)
        //let's hope top applet is always active
        var pm = SiebelApp.S_App.GetActiveView().GetActiveApplet().GetPModel();
        var bc = pm.Get("GetBusComp").GetName();
        var scriptables = ["Repository Applet", "Repository Application", "Repository Business Component", "Repository Business Service"];
        if (scriptables.includes(bc)) {
            var fi = pm.Get("GetFullId");
            var ae = $("#" + fi);
            var btns = ae.find(".siebui-btn-grp-applet");
            var btn = $('<div id="devpops_openscripteditor" class="siebui-ctrl-btn"><ul><li id="devpops_se_1" title="devpops: Open Server Script Editor" aria-label="devpops: Open Server Script Editor">📓</li></ul></div>');
            btn.on("click", function () {
                var svc = SiebelApp.S_App.GetService("Script Editor UI Service");
                var ips = SiebelApp.S_App.NewPropertySet();
                var ops = svc.InvokeMethod("Edit Server Scripts", ips);
            })
            if (ae.find("#devpops_openscripteditor").length == 0) {
                btns.prepend(btn);
            }
        }
    }
    catch (e) {
        console.log("BCRMMoarButtons: Error: " + e.toString());
    }
};

//Enhance Server Script Editors
BCRMEnhanceServerScriptEditor = function () {
    try {
        var pm = SiebelApp.S_App.GetActiveView().GetActiveApplet().GetPModel();
        var fi = pm.Get("GetFullId");
        var ae = $("#" + fi);
        var btns = ae.find("#scriptEditorActivateScript").parent();
        var btn = $('<div id="devpops_dbg" class="siebui-ctrl-btn"><ul><li id="devpops_dbg_1" title="devpops: Open Script Debugger" aria-label="devpops: Open Script Debugger">🐞</li></ul></div>');
        btn.on("click", function () {
            var tt = ae.find(".siebui-applet-title").text();
            var ot = tt.split(" [")[0];
            if (ot == "BusComp") {
                ot = "Business Component";
            }
            if (ot == "Service") {
                ot = "Business Service";
            }
            if (ot == "WebApplet") {
                ot = "Applet";
            }
            var rn = tt.split(" [")[1].split("]")[0];
            var m = ae.find(".fancytree-active").text();
            BCRMOpenScriptDebugger(rn, ot, m);
        });
        if (ae.find("#devpops_dbg").length == 0) {
            btns.prepend(btn);
        }
    }
    catch (e) {
        console.log("BCRMEnhanceServerScriptEditor: Error: " + e.toString());
    }
};

//Add click handler for active WS banner in Web Tools
BCRMEnhanceWSBanner = function () {
    var b = $("div.siebui-active-ws");
    var nt = "";
    var vn = SiebelApp.S_App.GetActiveView().GetName();
    //avoid double-call
    if (b.attr("bcrm-vn") != vn) {
        b.attr("bcrm-vn", vn);
        if (SiebelApp.S_App.GetAppName() == "Siebel Web Tools") {
            b.off("click");
            nt = "Left-click: Show modified objects";
            b.on("click", function (e) {
                BCRMDisplayObjectsForWS();
            });
        }
        //add quick select for web tools WSDB
        if (SiebelApp.S_App.GetAppName() == "Siebel Web Tools" && vn == "WSUI Dashboard View") {
            nt += "\nRight-click: Select in WS Dashboard";
            b.off("contextmenu");
            b.on("contextmenu", function () {
                BCRMGetWSContext();
                let wsn = sessionStorage.BCRMCurrentWorkspace;
                let wsv = sessionStorage.BCRMCurrentWorkspaceVersion;
                BCRMQueryWSList(wsn, wsn, wsv);
                return false;
            });
        }
        b.attr("title", nt);
        b.css("cursor", "pointer");
    }
};

//devpops style for dialogs
BCRMInjectDialogStyle = function () {
    BCRMInjectCSS("bcrmdlg1", ".ui-dialog.bcrm-dialog, .ui-dialog.bcrm-dialog div, .ui-dialog.bcrm-dialog span {background: #29303f;color: papayawhip;font-family: 'Roboto';font-weight: 300!important;line-height: 1.6;}");
    BCRMInjectCSS("bcrmdlg2", ".ui-dialog.bcrm-dialog input, .ui-dialog.bcrm-dialog select, .ui-dialog.bcrm-dialog textarea {background: papayawhip;border: none;line-height: 1.6;font-family: 'Roboto'!important;font-weight: 300!important;margin-bottom:4px;}");
    BCRMInjectCSS("bcrmdlg3", ".ui-dialog.bcrm-dialog button {background: papayawhip;border: none!important;line-height: 1.6;font-family: 'Roboto'!important;font-weight: 300!important;font-size: 1.6em!important;border-radius: 10px;cursor: pointer;}");
    BCRMInjectCSS("bcrmdlg4", ".ui-dialog.bcrm-dialog .ui-dialog-titlebar-close {display: none;}");
    BCRMInjectCSS("bcrmdlg5", ".ui-dialog.bcrm-dialog .ui-resizable-se {width: 9px;height: 9px;right: -5px;bottom: -5px;}");
    BCRMInjectCSS("bcrmdlg6", ".ui-dialog.bcrm-dialog {box-shadow: none!important;margin: 0px!important;}");
    BCRMInjectCSS("bcrmdlg7", ".ui-dialog.bcrm-dialog .CodeMirror * {background: papayawhip;color: #29303f;font-family: monospace;font-size: 14px;}");
    BCRMInjectCSS("bcrmdlg8", ".ui-dialog.bcrm-dialog canvas {background: papayawhip!important;border-radius: 10px;}");
    BCRMInjectCSS("bcrmdlg9", ".ui-dialog.bcrm-dialog .bcrm-av * {z-index: 100;background: white;}");
};

//Enhance list applet: keep focus on column during query
BCRMQueryFocus = function (m) {
    try {
        var pm = this;
        if (typeof (pm.Get) !== "function") {
            pm = SiebelApp.S_App.GetActiveView().GetActiveApplet().GetPModel();
        }
        if (typeof (pm.Get) == "function") {
            if (pm.Get("BCRM_QUERYFOCUS") != "true") {
                pm.AddMethod("InvokeMethod", BCRMQueryFocus, { sequence: true, scope: pm });
                pm.AddMethod("InvokeMethod", BCRMQueryFocus, { sequence: false, scope: pm });
                pm.SetProperty("BCRM_QUERYFOCUS", "true");
            }
            if (m == "NewQuery" || m == "RefineQuery") {
                var fi = pm.Get("GetFullId");
                var ae = $("#" + fi);
                //first pass (sequence:true)
                if (typeof (pm.Get("BCRM_FCOL")) === "undefined" || pm.Get("BCRM_FCOL") == "") {
                    var fc = ae.find("td.edit-cell");
                    var cn = fc.attr("aria-roledescription");
                    pm.SetProperty("BCRM_FCOL", cn);
                }
                //second pass (sequence:false)
                else {
                    setTimeout(function () {
                        var cn2 = pm.Get("BCRM_FCOL");
                        var fc2 = ae.find("td[aria-roledescription='" + cn2 + "']");
                        fc2[0].scrollIntoViewIfNeeded();
                        fc2.focus();
                        fc2.click();
                        setTimeout(function () {
                            fc2.find("input").css("background", "papayawhip");
                            fc2.find("textarea").css("background", "papayawhip");
                            fc2.find("input").focus();
                            fc2.find("textarea").focus();
                        }, 100)
                    }, 300);
                }
            }
            if (m == "ExecuteQuery" || m == "UndoQuery") {
                //Reset
                pm.SetProperty("BCRM_FCOL", "");
            }
        }
    }
    catch (e) {
        console.log("BCRMQueryFocus: Error: " + e.toString());
    }
};

//Get record set with actual display names
BCRMGetDisplayRecordSet = function (pm) {
    //get mapped record set
    var cs = pm.Get("GetControls");
    var rd = pm.Get("GetRecordSet");
    var rs = [];
    var hidden = ["Outline Number", "Has Children", "Is Expanded", "Id", "Parent Asset Id", "Hierarchy Level", "Is Leaf", "Parent Id"];
    //get record set with display names
    for (var i = 0; i < rd.length; i++) {
        var t = {};
        for (fx in rd[i]) {
            if (typeof (cs[fx]) !== "undefined") {
                t[cs[fx].GetDisplayName()] = rd[i][fx];
            }
            else if (fx != "" && typeof (fx) !== "undefined") {
                if (hidden.indexOf(fx) == -1) {
                    t[fx] = rd[i][fx];
                }
            }
        }
        rs.push(t);
    }
    return rs;
};

//JSON to table (e.g. record set)
BCRMGetTableFromListPM = function (pm) {
    //get record set with display names
    var rs = BCRMGetDisplayRecordSet(pm);
    //table header
    var t = $("<table>");
    var h = $("<thead><tr>");
    for (c in rs[0]) {
        if (typeof (c) !== "undefined") {
            var th = $("<th>");
            th.text(c);
            h.find("tr").append(th);
        }
    }
    //table body
    var b = $("<tbody>")
    for (r in rs) {
        var tr = $("<tr>");
        for (f in rs[r]) {
            if (typeof (f) !== "undefined") {
                var td = $("<td>");
                td.text(rs[r][f]);
                tr.append(td);
            }
        }
        b.append(tr);
    }
    t.append(h);
    t.append(b);
    return t;
};

//a new face for About View?
BCRMAboutTime = function () {
    var v = $("#_sweview").clone();
    var view = SiebelApp.S_App.GetActiveView();
    var vn = view.GetName();
    var am = view.GetAppletMap();
    //zoom not supported in Firefox, but transform scale is weird
    v.css("zoom", "0.4");
    //v.css("transform","scale(0.4)")
    v.css("overflow", "auto");
    v.addClass("bcrm-av");
    var aps = v.find("div[id^='S_A']").not("[id*='CommitNotifyContainer']");
    //aps.css("border","1px solid darkblue");
    v.find("*").css("pointer-events", "none");
    aps.each(function (x) {
        var fi = $(this).attr("id");
        var pm;
        var an = "";
        var bc = "";
        for (a in am) {
            if (am[a].GetPModel().Get("GetFullId") == fi) {
                pm = am[a].GetPModel();
                break;
            }
        }
        if (pm && typeof (pm.Get) === "function") {
            an = pm.GetObjName();
            bc = pm.Get("GetBusComp").GetName();

        }
        var ae = $(this).find("#s_" + fi + "_div");
        var cv = $("<div class='bcrm-cover'>");
        cv.attr("bcrm-rn", an);
        cv.attr("bcrm-ot", "Applet");
        cv.text(an + " [" + bc + "]");
        cv.attr("title", "Applet: " + an + "\nBusComp: " + bc);
        ae.prepend(cv);
        $(this).css("margin", "4px");
    });
    v.dialog({
        title: vn,
        width: 700,
        classes: {
            "ui-dialog": "bcrm-dialog"
        },
        buttons: {
            "Workspace History": function () {
                let sel = $(this).dialog().find(".bcrm-cover-active");
                let rn = sel.attr("bcrm-rn");
                let ot = sel.attr("bcrm-ot");
                BCRMDisplayWSHistory(rn, ot);
            },
            "Close": function () {
                $(this).dialog("destroy");
                setTimeout(function () {
                    $(".bcrm-av").remove();
                }, 50);
            }
        },
        open: function () {
            $(".bcrm-cover").each(function (x) {
                $(this).attr("style", "cursor:pointer;pointer-events:all!important;background:rgb(100 181 246 / 40%);border:1px solid darkblue;position:absolute;z-index:1000;color:black;font-size:36px;font-weight:600!important;text-align:center;");
                $(this).width($(this).parent().width());
                $(this).height($(this).parent().height());
                $(this).on("click", function () {
                    $(".bcrm-cover-active").each(function (y) {
                        $(this).css("outline", "none");
                        $(this).removeClass("bcrm-cover-active");
                    })
                    $(this).addClass("bcrm-cover-active");
                    $(this).css("outline", "8px solid limegreen");
                });
            });
        }
    })
};


//shoelace experiment
var BCRM_SL_LOADED = false;
//Inject shoelace
if (!BCRM_SL_LOADED) {
    if ($("link[href*='shoelace']").length == 0) {
        let slcss = $('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0/dist/themes/light.css" />');
        let sljs = $('<script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0/dist/shoelace.js"></script>');
        $("head").append(slcss);
        $("head").append(sljs);
        //shoelace toast CSS
        BCRMInjectCSS("shoelace1", ".sl-toast-stack{top: unset;bottom: 0;display: flex;flex-direction: column-reverse;}");
        BCRM_SL_LOADED = true;
    }
}
//add pretty tooltips
BCRMTooltipMod = function () {
    setTimeout(function () {
        $("li[title],button[title]").each(function () {
            let t = $(this).attr("title");
            $(this).attr("title", "");
            let slt = $("<sl-tooltip placement='bottom' content='" + t + "'></sl-tooltip>");
            $(this).wrap(slt);
        })
    }, 300);
};
//toast á la shoelace
BCRMToast = function (message, variant = 'primary', icon = 'info-circle', duration = 3000) {
    const toastme = Object.assign(document.createElement('sl-alert'), {
        variant,
        closable: true,
        duration: duration,
        innerHTML: `
        <sl-icon name="${icon}" slot="icon"></sl-icon>
        ${message}
      `
    });

    document.body.append(toastme);
    return toastme.toast();
};

BCRMShowDrawer = function () {
    const tree = BCRMGetDrawerTree();
    if ($(".dp-drawer-main").length == 0) {
        let drawer = $('<sl-drawer label="devpops ' + devpops_dver + '" contained placement="start" class="dp-drawer-main" style="--size: 20rem;"><sl-icon-button class="dp-drawer-edit" slot="header-actions" name="pencil" title="Edit"></sl-icon-button><sl-icon-button style="display:none;" class="dp-drawer-save" slot="header-actions" name="save" title="Save"></sl-icon-button><sl-button class="dp-drawer-closebtn" slot="footer" variant="primary">Close</sl-button></sl-drawer>');
        $("#_sweview").prepend(drawer);
        const closebtn = drawer[0].querySelector('.dp-drawer-closebtn');
        closebtn.addEventListener('click', () => {
            $(".dp-drawer-main")[0].hide();
            $("#bcrm_sl_drawer_btn").show();
        });
        const editbtn = drawer[0].querySelector('.dp-drawer-edit');
        editbtn.addEventListener("click", () => {
            $(".dp-drawer-main").find(".dp-tree-item").each(function () {
                $(this).show();
                $(this)[0].expanded = true;
            });
            $(".dp-drawer-main").find(".dp-drawer-save").show();
            $(".dp-drawer-main").find(".dp-drawer-edit").hide();
            $(".dp-drawer-main").find(".dp-cbox").show();
        });
        const savebtn = drawer[0].querySelector('.dp-drawer-save');
        savebtn.addEventListener("click", () => {
            $(".dp-drawer-main").find(".dp-drawer-save").hide();
            $(".dp-drawer-main").find(".dp-drawer-edit").show();
            $(".dp-drawer-main").find("#drawer_tree").empty();
            $(".dp-drawer-main").find("#drawer_tree").append(BCRMGetDrawerTree());
        });
        drawer[0].addEventListener('sl-hide', event => {
            $("#bcrm_sl_drawer_btn").show();
        });
        $(".dp-drawer-main").append("<div id='drawer_tree'>");
        $(".dp-drawer-main").find("#drawer_tree").append(tree);
    }
    else {
        $(".dp-drawer-main").find("#drawer_tree").empty();
        $(".dp-drawer-main").find("#drawer_tree").append(tree);
    }
    $(".dp-drawer-main")[0].open = true;
};

ShowOptionsSL = function (m) {
    let BCRM_MENU_SL = BCRMGetSLMenu();
    const opt = BCRM_MENU_SL[m].options;
    let prefix = "BCRM_OPT_" + m + "_";
    let title = BCRM_MENU_SL[m].label + " Options";
    let dlg = $("<sl-dialog id='" + prefix + "' label='" + title + "'><sl-button class='dlg-savego-btn' slot='footer' variant='primary'>Save + Go</sl-button><sl-button class='dlg-save-btn' slot='footer' variant='primary'>Save</sl-button><sl-button class='dlg-close-btn' slot='footer' variant='primary'>Cancel</sl-button></sl-dialog>");
    const closeButton = dlg[0].querySelector('sl-button.dlg-close-btn');
    closeButton.addEventListener('click', () => dlg.hide());
    const saveButton = dlg[0].querySelector('sl-button.dlg-save-btn');
    saveButton.addEventListener('click', () => {
        $("#" + prefix).find(".bcrm-option").each(function (x) {
            let sn = $(this).attr("id");
            localStorage.setItem(sn, $(this).val().replaceAll("__", " "));
        });
        dlg.hide();
    });
    const saveGoButton = dlg[0].querySelector('sl-button.dlg-savego-btn');
    saveGoButton.addEventListener('click', () => {
        $("#" + prefix).find(".bcrm-option").each(function (x) {
            let sn = $(this).attr("id");
            localStorage.setItem(sn, $(this).val().replaceAll("__", " "));
        });
        BCRM_MENU_SL[m].saveandgo();
        dlg.hide();
    });
    for (o in opt) {
        var sn = prefix + o;
        var def = localStorage.getItem(sn) ? localStorage.getItem(sn) : opt[o].default;
        if (opt[o].type == "select") {
            let lov = opt[o].lov;

            let sel = "<sl-select class='bcrm-option' id='" + sn + "' style='margin-bottom:12px;' label='" + opt[o].label + "' value='" + def.replaceAll(" ", "__") + "' help-text='" + opt[o].tip + "'>";
            for (var i = 0; i < lov.length; i++) {
                sel += "<sl-option value='" + lov[i].replaceAll(" ", "__") + "'>" + lov[i] + "</sl-option>";
            }
            sel += "</sl-select>";
            dlg.append(sel);
        }
        else {
            let ip = "<sl-input class='bcrm-option' id='" + sn + "' type='" + opt[o].type + "' style='margin-bottom:12px' label='" + opt[o].label + "' value='" + def + "' help-text='" + opt[o].tip + "'></sl-input>";
            dlg.append(ip);
        }
    }
    $("#" + prefix).remove();
    $("body").append(dlg);
    $("#" + prefix)[0].show();
};

BCRMGetDrawerTree = function () {
    let tree = $("<sl-tree></sl-tree>");
    let p = 1;
    let BCRM_MENU_SL = BCRMGetSLMenu();
    for (i in BCRM_MENU_SL) {
        let pos = BCRM_MENU_SL[i].pos;

        //root level
        if (pos.indexOf(".") == -1) {
            let me = BCRM_MENU_SL[i];
            let selected = "";
            let expanded = "";
            let dpdefaultexpand = false;
            var root_enabled = me.enable;
            if (pos == "1") {
                selected = "selected";
                expanded = "expanded";
                dpdefaultexpand = true;
            }
            let mec = $("<div style='display:flex;justify-content:space-between;width:160px;'>");
            let cbox = $("<div><sl-checkbox style='display:none;' class='dp-cbox root' dp-for='" + i + "'></sl-checkbox></div>");
            cbox.find(".dp-cbox")[0].addEventListener("sl-change", event => {
                event.stopImmediatePropagation();
                let item = $(event.target).attr("dp-for");
                let id = "BCRM_MENU_ENABLE_" + item;
                var ischecked = event.target.checked;
                localStorage.setItem(id, ischecked);
                /*
                $("#" + item + ".dp-tree-item").find(".dp-cbox").each(function(){
                    this.checked = ischecked;
                });
                */
            });
            let melbl = $("<div class='tree-item-label'>");
            melbl.append("<span>").text(me.label);
            if (typeof (me.onclick) !== "undefined") {
                melbl.on("click", me.onclick);
            }
            mec.append(melbl);

            let item = $("<sl-tree-item id='" + i + "' class='dp-tree-item root' " + selected + " " + expanded + "></sl-tree-item>");
            if (dpdefaultexpand) {
                item.addClass("dpdefaultexpand");
            }
            item.attr("title", me.title);
            item.append(cbox);
            item.append(mec);
            p = 1;
            //find nested items, only one child level supported by now
            let spos = pos + "." + p;
            for (ni in BCRM_MENU_SL) {
                let t = BCRM_MENU_SL[ni];
                if (t.pos == spos) {
                    if (true) {
                        let nc = $("<div style='display:flex;justify-content:space-between;width:150px;'>");
                        let nclbl = $("<div class='tree-item-label'>");
                        nclbl.append("<span>").text(t.label);
                        nclbl.on("click", t.onclick);
                        nc.append(nclbl);
                        let nitem = $("<sl-tree-item id='" + ni + "' class='dp-tree-item leaf'></sl-tree-item>");
                        nitem.attr("title", t.title);
                        let nicbox = $("<div><sl-checkbox style='display:none;' class='dp-cbox' dp-for='" + ni + "'></sl-checkbox></div>");
                        nicbox.find(".dp-cbox")[0].addEventListener("sl-change", event => {
                            event.stopImmediatePropagation();
                            let item = $(event.target).attr("dp-for");
                            let id = "BCRM_MENU_ENABLE_" + item;
                            let ischecked = event.target.checked;
                            localStorage.setItem(id, ischecked);
                            return false;
                        });
                        if (t.showtoggle) {
                            let tgln = "toggle_" + ni;
                            let tgl = $("<div id='" + tgln + "'><sl-switch size='medium' style='--thumb-size:14px;'></sl-switch></div>");
                            tgl.attr("title", "Enable permanently");
                            if (sessionStorage[tgln] === "true") {
                                tgl.find("sl-switch")[0].checked = true;
                            }
                            tgl.find("sl-switch")[0].addEventListener("sl-change", event => {
                                let tgl = event.target;
                                let is_checked = tgl.checked;
                                let tglname = $(tgl).parent().attr("id");
                                let mname = tglname.split("_")[1];
                                sessionStorage[tglname] = is_checked;
                                if (is_checked) {
                                    if (typeof (BCRM_MENU_SL[mname].toggle_exclude) !== "undefined") {
                                        BCRMToast("X-Ray default set to: " + mname, "primary", "toggle-on");
                                        sessionStorage.BCRM_TOGGLE_DEFAULT = mname;
                                        let elist = BCRM_MENU_SL[mname].toggle_exclude;
                                        for (let i = 0; i < elist.length; i++) {
                                            let eln = "toggle_" + elist[i];
                                            $(".dp-drawer-main").find("#" + eln).find("sl-switch")[0].checked = false;
                                            sessionStorage[eln] = false;
                                        }
                                    }
                                }
                                else {
                                    if (typeof (BCRM_MENU_SL[mname].toggle_exclude) !== "undefined") {
                                        sessionStorage.BCRM_TOGGLE_DEFAULT = "";
                                    }
                                }
                            });
                            nc.append(tgl);
                        }
                        if (t.showoptions) {
                            let on = "options_" + ni;
                            let obtn = $("<div id='" + on + "'><sl-icon-button name='gear' label='Options'></sl-icon-button></div>");
                            obtn.attr("title", "Settings");
                            obtn.find("sl-icon-button")[0].addEventListener("click", event => {
                                let btn = event.target;
                                let id = $(btn).parent().attr("id");
                                let mname = id.split("_")[1];
                                ShowOptionsSL(mname);
                            });
                            nc.append(obtn);
                        }

                        nitem.append(nicbox);
                        nitem.append(nc);
                        item.append(nitem);
                        if (!t.enable || !root_enabled) {
                            nitem.hide();
                            nitem.addClass("dp-hidden");
                        }
                        if (t.enable) {
                            nitem.find(".dp-cbox")[0].checked = true;
                        }
                    }
                    p++;
                    spos = pos + "." + p;
                }
            }
            tree.append(item);
            if (!root_enabled) {
                item.hide();
                item.addClass("dp-hidden");
            }
            else {
                item.find(".dp-cbox")[0].checked = true;
            }
        }
    }
    return tree;
};

//Online Help URL
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMGetToolsHelpURL = function () {
    var retval;
    var seblver;
    var url1 = "https://docs.oracle.com/cd/";
    var url2 = "/portalres/pages/other_toolshelp.htm";
    if (typeof (localStorage.BCRM_SIEBEL_VERSION) === "undefined") {
        alert("Siebel version information not found. Please log in to a Siebel application session with devpops in the same browser and try again.");
    }
    else {
        seblver = localStorage.BCRM_SIEBEL_VERSION.split(".")[0] + "." + localStorage.BCRM_SIEBEL_VERSION.split(".")[1];
        retval = url1 + bcrm_help_map[seblver] + url2;
    }
    return retval;
};

//Online Help Menu
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMSetToolsHelpContent = function () {
    var url = BCRMGetToolsHelpURL();
    if (typeof (url) != "undefined") {
        $("[data-caption='&Help']").find("a").each(function (x) {
            if ($(this).text().indexOf("Contents") != -1) {
                $(this).off("click");
                $(this).parent().off("click");
                $(this).attr("href", url);
                $(this).attr("target", "_blank");
                $(this).text("Online Help");
                $(this).on("click", function (e) {
                    e.stopImmediatePropagation();
                });
            }
        });
    }
};

//main postload function for Web Tools
//THIS FUNCTION MUST BE IN VANILLA postxload.js to work in Web Tools!
BCRMWTHelper = function () {
    try {
        //prevent double loading
        var vn = SiebelApp.S_App.GetActiveView().GetName();
        if (vn == "WSUI Dashboard View" || sessionStorage.BCRM_CURRENT_VIEW != vn) {
            //enhance Web Tools
            if (SiebelApp.S_App.GetAppName() == "Siebel Web Tools") {

                var do_postnav_query = false;

                //General enhancements
                BCRMWebToolsEnhancer();

                //update current open WS
                BCRMGetWSContext();

                //process postload after ws db navigation
                //#1 already in nav target view
                if (vn == sessionStorage.BCRM_DBNAV_VIEW) {
                    if (sessionStorage.BCRM_DBNAV_GO == "yes") {
                        sessionStorage.BCRM_DBNAV_GO = "";
                    }
                    console.log("BCRMWTHelper (postload): (already) in WSDB nav target view, starting post-nav query");
                    do_postnav_query = true;
                }
                else {
                    //#2 coming back to a different view and not WS Dashboard
                    if (vn != "WSUI Dashboard View" && sessionStorage.BCRM_DBNAV_VIEW != "") {
                        if (sessionStorage.BCRM_DBNAV_GO == "yes") {
                            sessionStorage.BCRM_DBNAV_GO = "";
                            console.log("BCRMWTHelper (postload): about to go to WSDB nav target view");
                            SiebelApp.S_App.GotoView(sessionStorage.BCRM_DBNAV_VIEW, null, "SWEKeepContext=1");
                            //this will come back to #1
                        }
                    }
                    //#3 coming back to WS Dashboard from reload (after open WS)
                    if (vn == "WSUI Dashboard View" && sessionStorage.BCRM_DBNAV_GO == "open") {
                        sessionStorage.BCRM_DBNAV_GO = "yes";
                        console.log("BCRMWTHelper (postload): back from WS dashboard reload, leaving now...");
                        //close WS dashboard
                        history.back();
                        //this will come back to #1 or #2
                    }
                }

                //the need of the view
                if (vn == "WT Repository Screen View List View") {
                    BCRMEnhanceScreenViewListApplet();
                }

                //add screen menu
                BCRMAddWTScreenMenu();

                //Point Help > Contents to Bookshelf for current version
                BCRMSetToolsHelpContent();

                //Pretty Banner, because we can

                if (typeof (sessionStorage.BCRMBANNERTIMER) === "undefined") {
                    BCRMPrettifyBanner();
                    sessionStorage.BCRMBANNERTIMER = 10;
                }
                else {
                    sessionStorage.BCRMBANNERTIMER = sessionStorage.BCRMBANNERTIMER - 1;
                    if (sessionStorage.BCRMBANNERTIMER <= 0) {
                        BCRMPrettifyBanner();
                        sessionStorage.BCRMBANNERTIMER = 10;
                    }
                }

                //Inject CSS
                //wide popups (uses :has pseudo-class: check caniuse.com for browser support)
                BCRMInjectCSS("devpops1", ".ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.ui-draggable.ui-resizable:has(.siebui-list){min-width:75vw!important;max-width:900px!important;}");

                //pretty W column
                BCRMInjectCSS("devpopsw1", "td[aria-roledescription='W'] span.siebui-icon-asterisk_gif img,td[aria-roledescription='W'] span.siebui-icon-asterisk_gif input{display:none;}");
                BCRMInjectCSS("devpopsw2", "td[aria-roledescription='W'] span.siebui-icon-asterisk_gif:before {content:\"\\e634\";font-family:'oracle';color: #1474bf;}");

                //dialog style
                BCRMInjectDialogStyle();

                //Add Lizard button
                BCRMAddLizardButton();

                //Add History Button
                BCRMAddHistoryButton();

                //Add Change Records Button (*gasp*)
                BCRMAddChangeRecordsButton();

                //Add Form navigation for 3-applet views
                BCRMAddFormNavigation();

                //Clickable WS Banner
                BCRMEnhanceWSBanner();

                //Enhance WS Dashboard
                if (vn == "WSUI Dashboard View") {
                    var opm = SiebelApp.S_App.GetActiveView().GetApplet("WSUI Dashboard - Objects List Applet").GetPModel();
                    BCRMEnhanceWSDashboard(opm);
                    if (opm.Get("BCRM_ENHANCE") != "true") {
                        opm.AddMethod("ShowSelection", BCRMEnhanceWSDashboard, { scope: opm, sequence: true });
                        opm.SetProperty("BCRM_ENHANCE", "true");
                    }
                }

                //Enhance WF Editor
                if (vn == "WT Repository Edit Workflow Process") {
                    BCRMEnhanceWFEditor();
                }

                //Enhance Server Script Views
                if (vn.indexOf("Server Script Editor") > -1) {
                    BCRMEnhanceServerScriptEditor();
                }

                //moar buttons
                BCRMMoarButtons();

                //Demo: add "drilldown"
                //BCRMAddDrilldown(vn);

                //post-nav query (WS drilldown)
                if (do_postnav_query) {
                    BCRMPostDBNavQuery(vn);
                }

                //Query Focus, uncomment at your own peril
                //BCRMQueryFocus();

                //shoelace titles to tooltips
                //BCRMTooltipMod();

                console.log("BCRM devpops extension for Siebel Web Tools loaded");

                //prevent double-loading
                sessionStorage.BCRM_CURRENT_VIEW = vn;
            }
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

//history tracker
//TODO: fix bug with CheckAppletReady function (random error)
var BCRM_HIST_APP = "BCRM_HISTORY_" + location.pathname.replaceAll("/", "_");
var BCRM_HISTORY = [];
var BCRM_HISTORY_MAX = 100;
//restore BCRM_HISTORY from localStorage 
if (typeof (localStorage[BCRM_HIST_APP]) !== "undefined") {
    if (localStorage[BCRM_HIST_APP].split("|").length > 0) {
        BCRM_HISTORY = localStorage[BCRM_HIST_APP].split("|");
    }
}

//source: https://stackoverflow.com/questions/3522090/event-when-window-location-href-changes
const BCRMTrackHistory = () => {
    let oldHref = document.location.href;
    const body = document.querySelector("body");
    const observer = new MutationObserver(mutations => {
        mutations.forEach(() => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;
                let hitem = {
                    time: Date.now(),
                    href: oldHref,
                    title: document.title,
                    vn: oldHref.split("SWEView=")[1].split("&")[0].replaceAll("+", " "),
                    srn: SiebelApp.S_App.GetSRN()
                };
                BCRMAddHistoryItem(hitem);
            }
        });
    });
    observer.observe(body, { childList: true, subtree: true });
};

BCRMAddHistoryItem = function (hitem) {
    BCRM_HISTORY.push(JSON.stringify(hitem));
    //max length
    if (BCRM_HISTORY.length > BCRM_HISTORY_MAX) {
        BCRM_HISTORY.shift();
    }
    localStorage[BCRM_HIST_APP] = BCRM_HISTORY.join("|");
};

BCRMGenerateHistoryList = function () {
    BCRMInjectCSS("bcrmhist01", "sl-card.bcrm-current-session::part(body) {background: #3272a85c;}");
    var hasdata = false;
    let cont = $("<div id='bcrm_hist_container'>");
    if (typeof (localStorage[BCRM_HIST_APP]) !== "undefined") {
        if (localStorage[BCRM_HIST_APP].split("|").length > 0) {
            hasdata = true;
        }
    }
    if (hasdata) {
        let ha = localStorage[BCRM_HIST_APP].split("|");
        let srn = SiebelApp.S_App.GetSRN();
        let isprior = false;
        ha.reverse();
        for (let i = 0; i < ha.length; i++) {
            let card = $("<sl-card style='width:100%;cursor:pointer;'></sl-card>");
            let hitem = JSON.parse(ha[i]);
            let d = new Date(hitem.time);
            card.append("<p id='bcrm_href' style='margin:0px;'><a href='" + hitem.href + "'>" + hitem.title + "</a></p>");
            card.append("<p style='margin:0px;font-size:0.7em;text-align:right;'>" + d.toLocaleString() + "</p>");
            card.attr("bcrm-vn", hitem.vn);
            card.on("click", function () {
                let url = $(this).find("#bcrm_href").find("a").attr("href");
                let hitem = {
                    time: Date.now(),
                    href: url,
                    title: $(this).find("#bcrm_href").text(),
                    vn: $(this).attr("bcrm-vn"),
                    srn: srn
                };
                BCRMAddHistoryItem(hitem);
                try {
                    top.CheckAppletReady = function (a, b) { return false; };
                    top.Top = function () { return window; };
                    window.location.replace(url);
                }
                catch (e) {
                    console.error("BCRMHistory error: " + e.toString());
                }
            })
            if (hitem.srn == srn) {
                card.addClass("bcrm-current-session");
                if (i == 0) {
                    cont.append("<h4>Current Session</h4>")
                }
            }
            else {
                if (!isprior) {
                    cont.append("<h4>Previous Sessions</h4>")
                }
                isprior = true;
            }
            cont.append(card);
        }
    }
    else {
        cont.append("<sl-card>No history data found.</sl-card>");
    }
    return cont;
}

BCRMShowHistoryList = function () {
    let dlg = $("<sl-dialog id='bcrm_history' label='" + "BCRM History" + "'><sl-button class='dlg-close-btn' slot='footer' variant='primary'>Close</sl-button></sl-dialog>");
    const closeButton = dlg[0].querySelector('sl-button.dlg-close-btn');
    closeButton.addEventListener('click', () => dlg.hide());
    const list = BCRMGenerateHistoryList();
    dlg.append(list);
    $("#bcrm_history").remove();
    $("body").append(dlg);
    $("#bcrm_history")[0].show();
}
window.onload = BCRMTrackHistory;
//workaround errors
top.CheckAppletReady = function (a, b) { return false; };
top.Top = function () { return window; };

//END devpops postload.js content
