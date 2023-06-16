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
//AppInfo
var BCRM_SIEBEL_V = {};
var BCRM_SYS;
var BCRM_WORKSPACE = {};

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

//23.6, finally a debug flag
//set to true to crank up console logging
devpops_debug = false;

//Banner prettifier
var bannerint;
BCRMPrettifyBanner = function () {
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
    //DRAFT: grab the main list applet
    var pm = SiebelApp.S_App.GetActiveView().GetActiveApplet().GetPModel();
    pm.AttachPMBinding("ShowSelection", BCRMWebToolsHighlight, { scope: pm, sequence: true });
    BCRMWebToolsHighlight(pm);
};

//moved to WT code for general support
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
//Collect user credentials for use in REST calls, stored as variable BCRM_BASIC_AUTH
var BCRM_BASIC_AUTH = "";
BCRMGetCredentials = function (next, opt = {}) {
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
                if (next == "entprof") {
                    BCRMGetEntProfiles();
                }
                if (next == "entprofparams") {
                    BCRMGetEntProfileParams(opt.payload);
                }
                if (next == "entprofquery") {
                    BCRMGetEntProfileParamsQuery(opt.payload, opt.on);
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    if (location.href.indexOf("WSUI+Dashboard+View") == -1) {
        devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
        var st = $("<style bcrm-temp-style_" + name + "='yes'>" + css + "</style>");
        if ($("style[bcrm-temp-style_" + name + "]").length == 0) {
            $("head").append(st);
        }
    }
};

BCRMUnInjectCSS = function (name) {
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
    if ($("style[bcrm-temp-style_" + name + "]").length > 0) {
        $("style[bcrm-temp-style_" + name + "]").remove();
    }
};

//Auto Column Resize: Add button (call from PR)
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMAddAutoResizeButton = function (pm) {
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), "BCRMUpdateListColumns") : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
    var btn = $('<div id="devpops_lizard" class="siebui-banner-btn"><ul class="siebui-toolbar" aria-label="devpops Lizard: Auto-resize List Columns"><li id="devpops_1" class="siebui-toolbar-enable" role="menuitem" title="devpops Lizard: Auto-resize List Columns" aria-label="devpops Lizard: Auto-resize List Columns" name="devpops Lizard: Auto-resize List Columns">🦎</li></ul></div>');
    if ($("#devpops_lizard").length == 0) {
        $("div#siebui-toolbar-settings").after(btn);
        btn.on("click", function () {
            let pm = SiebelApp.S_App.GetActiveView().GetActiveApplet().GetPModel();
            BCRMAutoResizeColumns(pm);
        })
    }
};

//23.6 and higher
//Add Favorites button
var BCRM_FAVS_INT;
BCRMAddFavoritesButton = function () {
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
    var btn = $('<div id="devpops_favs" class="siebui-banner-btn"><ul class="siebui-toolbar" aria-label="devpops Favs"><li id="devpops_1" class="siebui-toolbar-enable" role="menuitem" aria-label="devpops Vavs" name="devpops Favs">⭐</li></ul></div>');
    btn.attr("title", "Left-click: Add selected record to favorites\nRight-click: Open Favorites List");
    if ($("#devpops_favs").length == 0) {
        $("div#siebui-toolbar-settings").after(btn);
        btn.on("contextmenu", function () {
            SiebelApp.S_App.GotoView("WT Favourites List Applet View");
            return false;
        });
        btn.on("click", function () {
            BCRMPopFavorites();
        })
    }
};

BCRMPopFavorites = function () {
    var opm = SiebelApp.S_App.GetActiveView().GetActiveApplet().GetPModel();
    let fn = "Name";
    if (SiebelApp.S_App.GetActiveView().GetName() == "WT Repository Workflow Process List View") {
        fn = "Process Name";
    }
    var fname = opm.Get("GetRawRecordSet")[opm.Get("GetSelection")][fn];
    opm.ExecuteMethod("InvokeMethod", "AddFavourites");

    //wait for favs popup and override name with the real thing
    BCRM_FAVS_INT = setInterval(function () {
        let am = SiebelApp.S_App.GetActiveView().GetAppletMap();
        if (Object.hasOwn(am, "WT Favourites Applet")) {
            let fpm = am["WT Favourites Applet"].GetPModel();
            let fpr = fpm.GetRenderer();
            if (typeof (fpr) !== "undefined") {
                clearInterval(BCRM_FAVS_INT);
                //set name and save
                let fnc = fpm.Get("GetControls")["Fav Name"];
                let fnel = fpr.GetUIWrapper(fnc).GetEl();
                fnel.val(fname.substring(0, 75));
                //fpm.ExecuteMethod("InvokeMethod","SaveFavourites");
                //BCRMToast("'" + fname + "' saved as Favorite");
            }
        }
    }, 50);
};

//"improve" WT Favourites List Applet View
BCRMEnhanceFavsView = function () {
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
    let pm = SiebelApp.S_App.GetActiveView().GetAppletMap()["WT Favourites List Applet"].GetPModel();
    let fi = pm.Get("GetFullId");
    if (pm.Get("BCRM_ENHANCE") != "true") {
        pm.AddMethod("ShowSelection", BCRMEnhanceFavsView, { scope: pm, sequence: true });
        pm.SetProperty("BCRM_ENHANCE", "true");
    }

    let ae = $("#" + fi);
    ae.find("td[aria-roledescription='Object Name']").each(function () {
        if ($(this).find("input").length > 0) {
            $(this).text($(this).find("input").val());
            $(this).find("input").hide();
        }
    });
    ae.find("td[aria-roledescription='Object Name']").each(function () {
        if ($(this).text().indexOf("WT Repository") > -1) {
            let ot = $(this).text();
            ot = ot.replaceAll("WT Repository", "");
            ot = ot.replaceAll("List Applet", "");
            $(this).text(ot);
            $(this).on("click", function () {
                BCRMEnhanceFavsView();
            })
        }
    });
}

BCRMGetFavorites = function (pm) {
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
    //list applets only for now
    if (typeof (pm) === "undefined") {
        pm = this;
    }
    if (pm.Get("GetListOfColumns")) {
        if (pm.Get("BCRM_GETFAVS") !== "true") {
            pm.AttachPMBinding("ShowSelection", BCRMGetFavorites, { sequence: true, scope: pm });
            pm.SetProperty("BCRM_GETFAVS", "true");
        }
        var user = SiebelApp.S_App.GetUserName();
        var rrs = pm.Get("GetRawRecordSet");
        var fi = pm.Get("GetFullId");
        var ae = $("#" + fi);
        var s = [];

        //cleanup
        ae.find(".bcrm-fav").each(function () {
            $(this).removeClass("bcrm-fav");
        });

        //CSS
        BCRMInjectCSS("favs001", "tr.bcrm-fav td{background:lightyellow!important;}");

        //get row-ids in a row for searching
        for (r in rrs) {
            if (typeof (rrs[r]["Id"]) !== "undefined") {
                s.push("[Record Id]='" + rrs[r]["Id"] + "'");
            }
        }
        var searchspec = s.join(" OR ");
        searchspec = "(" + searchspec + ")";
        searchspec += " AND [Owner Name]='" + user + "'";

        var myHeaders = new Headers();
        //myHeaders.append("Authorization", "Basic U0FETUlOOldlbGNvbWUx");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(location.origin + "/siebel/v1.0/data/BCRM Repository Details/Repository Repository/*/BCRM List Of Favourites?uniformresponse=y&searchspec=" + searchspec, requestOptions)
            .then(response => response.text())
            .then(result => {
                let res = JSON.parse(result);
                if (typeof (res.items) !== "undefined") {
                    let items = res.items;
                    ae.find("tr[role='row']").each(function () {
                        let row = $(this);
                        if (typeof (row.attr("id")) !== "undefined") {
                            let x = parseInt(row.attr("id")) - 1;
                            let rowid = rrs[x]["Id"];
                            for (i in items) {
                                if (items[i]["Record Id"] == rowid) {
                                    row.addClass("bcrm-fav");
                                    break;
                                }
                            }
                        }
                    });
                }
            })
            .catch(error => {
                //do nothing
            });
    }
};

//Add History button
BCRMAddHistoryButton = function () {
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
        if (location.href.indexOf("WSUI+Dashboard+View") == -1) {
            devpops_debug ? console.log(Date.now(), "BCRMGetWSContext") : 0;
            var svwecp = SiebelApp.S_App.GetService("Web Engine Client Preferences");
            var ip = SiebelApp.S_App.NewPropertySet();
            if (typeof (svwecp.InvokeMethod) === "function") {
                var op = svwecp.InvokeMethod("GetActiveWSContext", ip);
                if (typeof (op) !== "undefined") {
                    op = op.GetChildByType("ResultSet");
                    sessionStorage.BCRMCurrentWorkspaceVersion = op.GetProperty("WSVersion");
                    sessionStorage.BCRMCurrentWorkspace = op.GetProperty("WSName");
                    sessionStorage.BCRMCurrentWorkspaceStatus = op.GetProperty("ActiveWSStatus");
                    //populate global WS variable (first time only)
                    if ($.isEmptyObject(BCRM_WORKSPACE)) {
                        BCRM_WORKSPACE.WS = sessionStorage.BCRMCurrentWorkspace
                        BCRM_WORKSPACE.VER = sessionStorage.BCRMCurrentWorkspaceVersion
                        BCRM_WORKSPACE.STATUS = sessionStorage.BCRMCurrentWorkspaceStatus
                    }
                    if (SiebelApp.S_App.GetAppName() != "Siebel Web Tools") {
                        BCRMWSUpdateWSBanner(sessionStorage.BCRMCurrentWorkspace, sessionStorage.BCRMCurrentWorkspaceVersion, sessionStorage.BCRMCurrentWorkspaceStatus);
                    }
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
    var svc = SiebelApp.S_App.GetService("Web Engine Client Preferences");
    var ips = SiebelApp.S_App.NewPropertySet();
    sessionStorage.BCRM_DBNAV_WSACTION = action;
    svc.InvokeMethod(action, ips);
};

//get all workspaces for a given object
//THIS FUNCTION MUST BE IN VANILLA postload.js to work in Web Tools!
BCRMWSGetWSForObject = function (rn, ot, searchspec) {
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
    if (typeof (ws) === "undefined") {
        devpops_debug ? console.log(Date.now(), "Calling BCRMGetWSContext from BCRMDisplayObjectsForWS") : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
    var curws = BCRMWSDBGetCurrentSelection();
    devpops_debug ? console.log(Date.now(), "Calling BCRMGetWSContext from BCRMDisplayWSForObject") : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), "Calling BCRMGetWSContext from BCRMDisplayWSHistory") : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
                devpops_debug ? console.log(Date.now(), "Calling BCRMGetWSContext from BCRMEnhanceWSBanner/contextmenu") : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
    //get mapped record set
    var cs = pm.Get("GetControls");
    var rd = pm.Get("GetRecordSet");

    //Full Record Set Example: Works with any custom business service capable of returning the full record set for the current applet
    //NOTE: This is not part of devpops due to security reasons, you must implement the custom BS yourself
    //rd = BCRMGetFullRecordSet(pm);

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

//requires custom BS (i.e. does not work in safe mode/webtools)
BCRMGetFullRecordSet = function (pm) {
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
    let fullrs = [];
    //hierarchical list applets have pseudo fields in PM
    let hidden = ["Outline Number", "Has Children", "Is Expanded", "Parent Asset Id", "Hierarchy Level", "Is Leaf", "Parent Id"];
    let rs = pm.Get("GetRecordSet");
    let sel = rs[pm.Get("GetSelection")];
    let bc = pm.Get("GetBusComp").GetName();
    let fieldlistPS = SiebelApp.S_App.NewPropertySet();
    let ops = SiebelApp.S_App.NewPropertySet();
    for (fn in sel) {
        if (hidden.indexOf(fn) == -1) {
            fieldlistPS.SetProperty(fn, "");
        }
    }
    //BCRM Dashboard Service is a placeholder for your custom BS which returns the full record set for a given BC within the active BO
    let activeBCdata = BCRMInvokeServiceMethod(
        {
            "service": "BCRM Dashboard Service",
            "method": "GetActiveBCData",
            "inputs":
            {
                "Business Component": bc,
                "RunQuery": "true",
                "FieldList": fieldlistPS.EncodeAsString()
            }
        });
    let result = activeBCdata.GetChildByType("ResultSet");
    let v = result.GetProperty("v");
    ops.DecodeFromString(v);
    let rc = ops.GetProperty("RecordCount");
    let stn = bc + "_count";
    sessionStorage[stn] = rc;
    let data = ops.GetChildByType("ObjectData");
    let cc = data.GetChildCount();
    for (let i = 0; i < cc; i++) {
        let cr = data.GetChild(i);
        let prop = cr.GetFirstProperty();
        let record = {};
        do {
            record[prop] = cr.GetProperty(prop);
            prop = cr.GetNextProperty();
        } while (prop != null);
        fullrs.push(record);
    }

    //re-order columns
    let temp = [];
    for (r in fullrs) {
        let tr = {}
        for (fn in rs[0]) {
            tr[fn] = fullrs[r][fn];
        }
        temp.push(tr);
    }
    fullrs = temp;

    return fullrs;
};

//JSON to table (e.g. record set)
BCRMGetTableFromListPM = function (pm) {
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
BCRMLoadShoelace = function () {
    if (!BCRM_SL_LOADED) {
        if (location.href.indexOf("WSUI+Dashboard+View") == -1) {
            devpops_debug ? console.log(Date.now(), "Loading shoelace") : 0;
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
    }
}
BCRMLoadShoelace();

//add pretty tooltips
BCRMTooltipMod = function () {
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), "BCRMToast") : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
    var retval;
    var seblver;
    var url1 = "https://docs.oracle.com/cd/";
    var url2 = "/portalres/pages/other_toolshelp.htm";
    if (typeof (localStorage.BCRM_SIEBEL_VERSION) === "undefined") {
        //alert("Siebel version information not found. Please log in to a Siebel application session with devpops in the same browser and try again.");
        //default
        seblver = "21.12";
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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

//moved from devpops.js to support Web Tools
//version check
//example input (20,7,"ge"): true if current version is greater than or equal to 20.7; false if current version is 20.6 or earlier
BCRMSiebelVersionCheck = function (y, m, mode) {
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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

//main postload function for Web Tools
//THIS FUNCTION MUST BE IN VANILLA postxload.js to work in Web Tools!
BCRMWTHelper = function () {
    try {
        //prevent double loading
        var am = SiebelApp.S_App.GetActiveView().GetAppletMap();
        var vn = SiebelApp.S_App.GetActiveView().GetName();
        if (vn == "WSUI Dashboard View" || sessionStorage.BCRM_CURRENT_VIEW != vn) {

            //enhance Web Tools
            if (SiebelApp.S_App.GetAppName() == "Siebel Web Tools") {
                devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
                var do_postnav_query = false;

                //load shoelace
                BCRMLoadShoelace();

                //General enhancements
                BCRMWebToolsEnhancer();

                //update current open WS
                devpops_debug ? console.log(Date.now(), "Calling BCRMGetWSContext from BCRMWTHelper") : 0;
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

                //23.6 or higher: Add Favs button
                if (BCRM_SYS != "NA") {
                    if (BCRMSiebelVersionCheck(23, 5, "ge")) {
                        BCRMAddFavoritesButton();
                    }
                }

                //Enhance Favs view
                if (vn == "WT Favourites List Applet View") {
                    BCRMEnhanceFavsView();
                }

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

                //23.6+ list applet hover box
                //for future use
                //comment this part to disable hover boxes in Web Tools
                //clean up hover boxes
                $("[id^='bcrm_box']").each(function () {
                    $(this).remove();
                });
                for (a in am) {
                    BCRMAddListRecordHover(am[a].GetPModel());
                }

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

//23.6+ new REST-less way of getting app version (reading <script> cache busting version, let's hope this lasts a while)
BCRMGetAppInfo = function(){
    devpops_debug ? console.log(Date.now(), "BCRMGetAppInfo") : 0;
    try{
        let v = $("script[src*='scb']")[0].outerHTML.split("scb=")[1].split(".0")[0];
        BCRM_SYS["Application Version"] = v;
        BCRM_SIEBEL_V = {
            y: v.split(".")[0],
            m: v.split(".")[1]
        }
        localStorage.BCRM_SIEBEL_VERSION = v;
    }
    catch(e){
        BCRM_SYS = "NA";
    }
};

//history tracker
//TODO: fix bug with CheckAppletReady function (random error)
/*
//ahansal: deactivated due to bugs not resolved
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
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
    BCRM_HISTORY.push(JSON.stringify(hitem));
    //max length
    if (BCRM_HISTORY.length > BCRM_HISTORY_MAX) {
        BCRM_HISTORY.shift();
    }
    localStorage[BCRM_HIST_APP] = BCRM_HISTORY.join("|");
};

BCRMGenerateHistoryList = function () {
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
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
};

BCRMShowHistoryList = function () {
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;
    let dlg = $("<sl-dialog id='bcrm_history' label='" + "BCRM History" + "'><sl-button class='dlg-close-btn' slot='footer' variant='primary'>Close</sl-button></sl-dialog>");
    const closeButton = dlg[0].querySelector('sl-button.dlg-close-btn');
    closeButton.addEventListener('click', () => dlg.hide());
    const list = BCRMGenerateHistoryList();
    dlg.append(list);
    $("#bcrm_history").remove();
    $("body").append(dlg);
    $("#bcrm_history")[0].show();
};

window.onload = BCRMTrackHistory;
//work around errors for BCRMTrackHistory
top.CheckAppletReady = function (a, b) { return false; };
top.Top = function () { return window; };
*/
//23.6: List Applets: show popup menu on record hover
var BCRM_CUR_BOX;
var BCRM_BOX_INT = [];
BCRMAddListRecordHover = function (pm) {
    devpops_debug ? console.log(Date.now(), arguments.callee.name) : 0;

    if (typeof (pm.Get) === "function") {
        //show faves
        BCRMGetFavorites(pm);
        var fi = pm.Get("GetFullId");
        var ae = $("#" + fi);

        //clean up
        $("[id^='bcrm_box']").each(function () {
            $(this).remove();
        });

        //list applets only
        if (pm.Get("GetListOfColumns")) {

            BCRMInjectCSS("hover001", "tr[bcrm-box='true']:{border:1px solid lightgray!important;}");

            //clean up globally on any other method, e.g. nextrecordset
            pm.AddMethod("InvokeMethod", function () {
                $("[id^='bcrm_box']").each(function () {
                    $(this).remove();
                });
            }, { scope: pm, sequence: true });

            $("#_sweview").removeAttr("title");

            ae.find("tr[role='row']").each(function () {
                if (typeof ($(this).attr("id")) !== "undefined") {

                    //main mouseover event handler
                    $(this).on("mouseover", function (e) {
                        //remove distracting tooltips (this could be done elsewhere)
                        $("#s_" + fi + "_div").removeAttr("title");
                        ae.find("td[title]").each(function () {
                            $(this).removeAttr("title");
                        });

                        //tr = table row/record
                        var tr = $(this);
                        var i = parseInt(tr.attr("id"));
                        let rrs = pm.Get("GetRawRecordSet");

                        //use ROW_ID for identification
                        var rowid = rrs[i - 1]["Id"];
                        tr.attr("bcrm-rowid", rowid);

                        //if no box is open for current row
                        if (tr.attr("bcrm-box") != "true") {

                            //remove all other boxes
                            $("[id^='bcrm_box']").each(function () {
                                if ($(this).attr("bcrm_rowid") != tr.attr("bcrm_rowid")) {
                                    $(this).remove();
                                }
                            });

                            let boxid = "bcrm_box_" + i;

                            //create box
                            if (BCRM_CUR_BOX != rowid && ae.find("#" + boxid).length == 0) {
                                let box = $("<div bcrm_rowid='" + rowid + "' id='" + boxid + "' style='box-shadow: 4px 4px 11px 0px rgb(210 233 245);z-index:99999;background:whitesmoke;border:1px solid darkgrey;border-radius:8px;width:150px;height:32px;position:absolute;'>");
                                //box.text(rowid);

                                //position
                                box.css("top", e.clientY + 0 + "px");
                                box.css("left", e.clientX + 4 + "px");

                                //select record on click
                                box.on("click", function () {
                                    $(this).attr("bcrm-active", "true");
                                    pm.ExecuteMethod("HandleRowSelect", i - 1);
                                });

                                box.on("mouseover", function () {
                                    $(this).attr("bcrm-active", "true");
                                });

                                //add buttons to do record-specific stuff, e.g. About Record, Add to Faves (TBD), Show Details, Drilldown,...

                                //Faves 23.6+ (Web Tools only)
                                if (SiebelApp.S_App.GetAppName() == "Siebel Web Tools" && BCRMSiebelVersionCheck(23, 5, "ge")) {
                                    let fbtn = $("<button title='Add To Favorites' style='cursor:pointer;margin:4px;width:26px;height:26px;background:transparent;border:0px;line-height:0'>⭐</button>");
                                    if (tr.hasClass("bcrm-fav")) {
                                        fbtn.text("🤩");
                                        fbtn.attr("title", "Already a fave");
                                    }
                                    fbtn.on("click", function () {
                                        pm.ExecuteMethod("HandleRowSelect", i - 1);
                                        if (!tr.hasClass("bcrm-fav")) {
                                            BCRMPopFavorites();
                                        }
                                    });
                                    box.append(fbtn);
                                }

                                //About Record
                                let abrbtn = $("<button title='About Record' style='cursor:pointer;margin:4px;width:26px;height:26px;background:transparent;border:0px;line-height:0'>🆎</button>");
                                abrbtn.on("click", function () {
                                    pm.ExecuteMethod("HandleRowSelect", i - 1);
                                    let ps = SiebelApp.S_App.NewPropertySet();
                                    ps.SetProperty("Command", "*Browser Applet* *AboutRecord*" + pm.GetObjName() + "*About Record Applet*450*160*true");
                                    ps.SetProperty("Method Argument", "About Record Applet");
                                    ps.SetProperty("SWEH", "160");
                                    ps.SetProperty("SWESP", "true");
                                    ps.SetProperty("SWEW", "450");
                                    let sps = ps.EncodeAsString();
                                    let ips = SiebelApp.S_App.NewPropertySet();
                                    ips.SetProperty("SWEIPS", sps);
                                    pm.ExecuteMethod("InvokeMethod", "AboutRecord", ips); //yup, it's that complicated...
                                    tr.attr("bcrm-box", "false");
                                    box.remove();
                                });
                                box.append(abrbtn);

                                $("body").append(box);

                                BCRM_CUR_BOX = rowid;


                                //remove open box after x seconds when not engaged

                                let iv = setInterval(function () {
                                    for (let i = 0; i < BCRM_BOX_INT.length; i++) {
                                        window.clearInterval(BCRM_BOX_INT[i]);
                                        BCRM_BOX_INT.splice(i, 1);
                                    }
                                    if ($("[id^='bcrm_box']").length > 0) {
                                        $("[id^='bcrm_box']").each(function () {
                                            if ($(this).attr("bcrm-active") != "true") {
                                                $(this).fadeOut(400, function () {
                                                    $(this).remove();
                                                });
                                            }
                                        })
                                    }
                                }, 3000);
                                BCRM_BOX_INT.push(iv);

                                tr.attr("bcrm-box", "true");
                            }
                        }
                    });

                    //reset row status on mouseout
                    $(this).on("mouseout", function (e) {
                        $(this).attr("bcrm-box", "false");
                        for (let i = 0; i < BCRM_BOX_INT.length; i++) {
                            window.clearInterval(BCRM_BOX_INT[i]);
                            BCRM_BOX_INT.splice(i, 1);
                        }
                    });
                }
            }); //end for each row
        }
    }
};

//23.6+ Repo Scanner, it not only scans the repo, it scans any other ol' BC for clues what the fella who quit 5 years ago really did leave behind
BCRMGetEntProfileParamsQuery = function (cfg, on) {
    devpops_debug ? console.log(Date.now(), "BCRMGetEntProfileParamsQuery") : 0;
    var retval;
    let query = cfg.query.replaceAll("$OBJ_NAME", on);
    let fields = cfg.fields.split(",");
    let qfields = query.split(" AND "); //we take it easy here, not allowing ORs
    let label = cfg.label;
    let ot = cfg.ot;
    let xfield = cfg.xfield;

    if (BCRM_BASIC_AUTH == "") {
        BCRMToast("Fetching Enterprise Profile data. Please stand by.", "primary", "info-circle", 10000);
        BCRMGetCredentials("entprofquery", { payload: cfg, on: on });
    }
    else {
        if (typeof (BCRM_REPO_SCAN_CACHE[label]) === "undefined") {
            BCRM_REPO_SCAN_CACHE[label] = [];
        }
        BCRMRepoScanShowResults(label, ot, on, true);
        retval = true;
        if (BCRM_ENTPROFILES.length == 0) {
            BCRMGetEntProfiles();
        }

        //1st pass: find ent profiles that match the query
        for (let q = 0; q < qfields.length; q++) {
            if (qfields[q].indexOf("SS_") != -1) {
                //part of the query that identifes the named subsystem
                let fn = qfields[q].split("]")[0].replace("[", "");
                let fv = qfields[q].split("='")[1].replaceAll("'", "");
                //find the named subsystem and fetch the parameters
                for (let i = 0; i < BCRM_ENTPROFILES.length; i++) {
                    if (BCRM_ENTPROFILES[i][fn] == fv) {
                        if (typeof (BCRM_ENTPROFILES[i]["PARAMS"]) === "undefined") {
                            let alias = BCRM_ENTPROFILES[i]["NSS_ALIAS"];
                            BCRMGetEntProfileParams(alias);
                        }
                    }
                }
            }
        }
        BCRMRepoScanShowResults(label, ot, on);
        let match = 0;

        //2nd pass: find params that match the query
        for (var i = 0; i < BCRM_ENTPROFILES.length; i++) {
            if (typeof (BCRM_ENTPROFILES[i]["PARAMS"]) !== "undefined") {
                match = 0;
                var matchid;
                for (let p = 0; p < qfields.length; p++) {
                    if (qfields[p].indexOf("PA_") != -1) {
                        let fn = qfields[p].split("]")[0].replace("[", "");
                        let fv = qfields[p].split("='")[1].replaceAll("'", "");
                        let params = BCRM_ENTPROFILES[i]["PARAMS"];

                        for (let pa = 0; pa < params.length; pa++) {
                            if (BCRM_ENTPROFILES[i]["PARAMS"][pa][fn] == fv) {
                                match++;
                                matchid = pa;
                                break;
                            }
                        }

                        if (match == qfields.length - 1) { //all matched (logical AND)
                            let item = {};
                            let itemx = [];
                            for (let f = 0; f < fields.length; f++) {
                                item[fields[f]] = BCRM_ENTPROFILES[i]["PARAMS"][matchid][fields[f]];
                            }
                            item["Parent Name"] = BCRM_ENTPROFILES[i]["NSS_ALIAS"];
                            if (typeof (BCRM_REPO_SCAN_CACHE[label]) === "undefined") {
                                BCRM_REPO_SCAN_CACHE[label] = [];
                            }
                            BCRM_REPO_SCAN_CACHE[label].push(item);
                            itemx.push(item);
                            BCRMRepoScanProcessExportData(itemx, on, ot, label, xfield);
                        }
                    }
                }
            }
        }
    }
    if (retval) {
        BCRMRepoScanShowResults(label, ot, on);
    }
    return retval;
};

var BCRM_REPO_SCAN_CACHE = [];
var BCRM_REPO_SCAN_CFG = {
    "defaults": {
        "Repository Script": {
            bc: ["Repository Application Server Script", "Repository Application Browser Script", "Repository Applet Server Script", "Repository Applet Browser Script", "Repository BusComp Server Script", "Repository BusComp Browser Script", "Repository Business Service Server Script", "Repository Business Service Browser Script",]
        }
    },
    "Applet": {
        search: { //for autocomplete of UI input element
            bc: "Repository Applet",
            query: "[Inactive]<>'Y' AND [Name] ~LIKE '$OBJ_NAME*'",
            fields: "Name"
        },
        ref: {
            "View": {
                bc: "Repository View Web Template Item",
                query: "[Applet]='$OBJ_NAME' AND [Inactive] <> 'Y' AND [GParent Inactive] <> 'Y'",
                fields: "Name,Comments,Applet,GParent BO,GParent Name",
                xfield: "Applet" //xfield = for exporting data as "referenced by field"
            },
            "Associate Applet": {
                bc: "Repository Applet",
                query: "[Associate Applet]='$OBJ_NAME' AND [Inactive] <> 'Y'",
                fields: "Name,Associate Applet,Comments",
                xfield: "Associate Applet"
            },
            "MVG Applet - Control": {
                bc: "Repository Control",
                query: "[MVG Applet]='$OBJ_NAME' AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,MVG Applet,Parent Name,Comments",
                xfield: "MVG Applet"
            },
            "MVG Applet - List Column": {
                bc: "Repository List Column",
                query: "[MVG Applet]='$OBJ_NAME' AND [Inactive] <> 'Y' AND [GParent Inactive] <> 'Y'",
                fields: "Name,MVG Applet,GParent Name,Comments",
                xfield: "MVG Applet"
            },
            "Pick Applet - Control": {
                bc: "Repository Control",
                query: "[Pick Applet]='$OBJ_NAME' AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,Pick Applet,Parent Name,Comments",
                xfield: "Pick Applet"
            },
            "Pick Applet - List Column": {
                bc: "Repository List Column",
                query: "[Pick Applet]='$OBJ_NAME' AND [Inactive] <> 'Y' AND [GParent Inactive] <> 'Y'",
                fields: "Name,Pick Applet,GParent Name,Comments",
                xfield: "Pick Applet"
            },
            "Open UI Manifest": {
                bc: "UI Object",
                query: "[Name] = '$OBJ_NAME' AND [Is Inactive] <> 'Y'",
                fields: "Name,UI File Names,Siebel Internal Read Only,Type Cd,Usage Type Cd",
                xfield: "Name"
            }
        }
    },
    "Business Component": {
        search: {
            bc: "Repository Business Component",
            query: "[Inactive]<>'Y' AND [Name] ~LIKE '$OBJ_NAME*'",
            fields: "Name"
        },
        ref: {
            "Applet": {
                bc: "Repository Applet",
                query: "[Business Component]='$OBJ_NAME' AND [Inactive] <> 'Y'",
                fields: "Name,Comments,Business Component",
                xfield: "Business Component"
            },
            "Applet User Property": {
                bc: "Repository Applet User Prop",
                query: "(([Name] ~LIKE '*bc*' OR [Name] ~LIKE '*buscomp*' OR [Name] ~LIKE '*aspect*') AND [Value] = '$OBJ_NAME') AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,Parent Name,Comments,Value",
                xfield: "Value"
            },
            "Business Object": {
                bc: "Repository Business Object",
                query: "[Primary Business Component]='$OBJ_NAME' AND [Inactive] <> 'Y'",
                fields: "Name,Comments,Primary Business Component",
                xfield: "Primary Business Component"
            },
            "Business Object Component": {
                bc: "Repository Business Object Component",
                query: "([BusComp]='$OBJ_NAME' OR [Link] LIKE '*/$OBJ_NAME*') AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Parent Name,Name,BusComp,Comments",
                xfield: "BusComp/Link(Child)"
            },
            "State Model": {
                bc: "State Model",
                query: "[BusComp Name] = '$OBJ_NAME' AND ([Expiration Date/Time] > Today() OR [Expiration Date/Time] IS NULL)",
                fields: "Name,BusComp Name,Field Name,Activation Date/Time,Expiration Date/Time",
                xfield: "BusComp"
            },
            "Workflow Step": {
                bc: "Repository WF Step",
                query: "[Business Component]='$OBJ_NAME' AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,Parent Name,Business Component,Comments",
                xfield: "Business Component"
            },
            "Workflow Step I/O Argument": {
                bc: "BCRM Repository WF Step IO Argument",
                query: "[Business Component]='$OBJ_NAME' AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y' AND [GParent Inactive] <> 'Y'",
                fields: "Name,Business Component,GParent Name,Comments",
                xfield: "Business Component"
            },
            "Data Validation Rule": {
                bc: "FINS Validation Rule",
                query: "[Business Component] = '$OBJ_NAME' AND ([End Date] IS NULL OR [End Date] > Today())",
                fields: "Name,Err Msg Text,Expression,Rule Set Id,Business Component,Apply To Type,Description,End Date",
                xfield: "Business Component"
            },
            "Audit Trail": {
                bc: "Audit Trail Buscomp",
                query: "[Buscomp] = '$OBJ_NAME' AND ([End Date] > Today() OR [End Date] IS NULL)",
                fields: "Buscomp,Start Date,End Date,Comments",
                xfield: "Business Component"
            },
            "Client-Side Script": {
                bc: "Business Service Script",
                query: "([Script] LIKE '*BusComp*(*$OBJ_NAME*)*') AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,Parent Name,Script,Comments",
                xfield: "Script"
            }
            /* Smart Script tables use LONG type for Script column, so this will not work:
            "Smart Script Question Script": {
                bc: "Call Script Question Scripts",
                query: "[Script] LIKE '*BusComp*(*$OBJ_NAME*)*'",
                fields: "Question Id, Name, Script, Program Language",
                xfield: "Script"
            }
            */
        },
        script: {
            "Repository Script": {
                query: "([Script] LIKE '*BusComp*(*\"$OBJ_NAME\"*)*') AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,Parent Name,Script,Comments",
                xfield: "Script"
            }
        }
    },
    "Business Service": {
        search: {
            bc: "Repository Business Service",
            query: "[Inactive]<>'Y' AND [Name] ~LIKE '$OBJ_NAME*'",
            fields: "Name"
        },
        ref: {
            "Application User Property": {
                bc: "Repository Application User Prop",
                query: "[Value] = '$OBJ_NAME' AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,Parent Name,Comments,Value",
                xfield: "Value"
            },
            "Runtime Event Action": {
                bc: "Personalization Action",
                query: "[BusProc Name]='$OBJ_NAME' AND [Active]='Y'",
                fields: "Name,Description,BusProc Name,BusProc Method,BusProc Context,Condition Expression",
                xfield: "BusProc Name"
            },
            "Command": {
                bc: "Repository Command",
                query: "[Business Service]='$OBJ_NAME' AND [Inactive] <> 'Y'",
                fields: "Name,Business Service,Method,Comments",
                xfield: "Business Service"
            },
            "Workflow Step": {
                bc: "Repository WF Step",
                query: "[Business Service Name]='$OBJ_NAME' AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,Parent Name,Business Service Name,Business Service Method,Comments",
                xfield: "Business Service Name"
            },
            "Calculated Field": {
                bc: "Repository Field",
                query: "[Calculated Value] LIKE '*InvokeServiceMethod*' AND [Calculated Value] LIKE '*$OBJ_NAME*' AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,Calculated Value,Parent Name,Comments",
                xfield: "Calculated Value"
            },
            "Client-Side Script": {
                bc: "Business Service Script",
                query: "([Script] LIKE '*GetService*(*$OBJ_NAME*)*') AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,Parent Name,Script,Comments",
                xfield: "Script"
            }
        },
        script: {
            "Repository Script": {
                query: "([Script] LIKE '*GetService*(*\"$OBJ_NAME\"*)*') AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,Parent Name,Script,Comments",
                xfield: "Script"
            },
            "Open UI JS": {
                keywords: [".GetService"],
                xfield: "Script"
            }
        },
        ent: {
            "EAI Data Handling Subsystem": {
                ot: "Business Service",
                function: BCRMGetEntProfileParamsQuery,
                label: "EAI Data Handling Subsystem",
                query: "[SS_ALIAS]='EAITransportDataHandlingSubsys' AND [PA_ALIAS]='DispatchService' AND [PA_VALUE]='$OBJ_NAME'",
                fields: "PA_ALIAS,PA_VALUE,PA_DEFAULT_VAL,PA_VISIBILITY",
                xfield: "PA_VALUE"
            }
        }
    },
    "Column": {
        search: {
            bc: "Repository Column",
            query: "[Inactive]<>'Y' AND [Parent Inactive]<>'Y' AND [Name] ~LIKE '$OBJ_NAME*'",
            fields: "Name"
        },
        ref: {
            "Field": {
                bc: "Repository Field",
                query: "[Column]='$OBJ_NAME' AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,Column,Join,Parent Name,Comments",
                xfield: "Column"
            },
            "Table": {
                bc: "Repository Column",
                query: "[Name]='$OBJ_NAME' AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,Physical Type Name,Text Length,Parent Name,Comments",
                xfield: "Column"
            },
            "Index": {
                bc: "Repository Index Column",
                query: "[Column Name]='$OBJ_NAME' AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y' AND [GParent Inactive] <> 'Y'",
                fields: "Name,Column Name,Parent Name,GParent Name",
                xfield: "Column Name"
            }
        }
    },
    "Field": {
        search: {
            bc: "Repository Field",
            query: "[Inactive]<>'Y' AND [Parent Inactive]<>'Y' AND [Name] ~LIKE '$OBJ_NAME*'",
            fields: "Name"
        },
        ref: {
            "Business Component": {
                bc: "Repository Field",
                query: "[Name]='$OBJ_NAME' AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,Parent Name,Comments",
                xfield: "Name"
            },
            "Applet Search Specification": {
                bc: "Repository Applet",
                query: "[Search Specification] LIKE '*[$OBJ_NAME]*' AND [Inactive] <> 'Y'",
                fields: "Name,Search Specification,Comments",
                xfield: "Search Specification"
            },
            "BC Search Specification": {
                bc: "Repository Business Component",
                query: "[Search Specification] LIKE '*[$OBJ_NAME]*' AND [Inactive] <> 'Y'",
                fields: "Name,Search Specification,Comments",
                xfield: "Search Specification"
            },
            "BC Sort Specification": {
                bc: "Repository Business Component",
                query: "[Sort Specification] LIKE '*$OBJ_NAME*' AND [Inactive] <> 'Y'",
                fields: "Name,Sort Specification,Comments",
                xfield: "Sort Specification"
            },
            "BC User Property": {
                bc: "Repository Business Component User Prop",
                query: "([Value] = '$OBJ_NAME' OR [Value] LIKE '*,$OBJ_NAME,*' OR [Value] LIKE '*, $OBJ_NAME,*') AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,Parent Name,Value,Comments",
                xfield: "Value"
            },
            "State Model": {
                bc: "State Model",
                query: "[Field Name] = '$OBJ_NAME' AND ([Expiration Date/Time] > Today() OR [Expiration Date/Time] IS NULL)",
                fields: "Name,BusComp Name,Field Name,Activation Date/Time,Expiration Date/Time",
                xfield: "Field Name"
            },
            "Applet Control": {
                bc: "Repository Control",
                query: "[Field]='$OBJ_NAME' AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,Field,Parent Name,Comments",
                xfield: "Field"
            },
            "Applet List Column": {
                bc: "Repository List Column",
                query: "[Field]='$OBJ_NAME' AND [Inactive] <> 'Y' AND [GParent Inactive] <> 'Y'",
                fields: "Name,Field,GParent Name,Comments",
                xfield: "Field"
            },
            "Data Validation Rule": {
                bc: "FINS Validation Rule",
                query: "[Expression] LIKE '*[$OBJ_NAME]*' AND ([End Date] IS NULL OR [End Date] > Today())",
                fields: "Name,Err Msg Text,Expression,Rule Set Id,Business Component,Apply To Type,Description,End Date",
                xfield: "Expression"
            },
            "Audit Trail": {
                bc: "Audit Trail Field",
                query: "[Field] = '$OBJ_NAME'",
                fields: "Field,Audit BC Name",
                xfield: "Field"
            },
            "Workflow Step": {
                //custom BC (copy of vanilla) needed because vanilla bc has slash in the name
                bc: "BCRM Repository WF Step IO Argument",
                query: "([Business Component Field] = '$OBJ_NAME' OR [Value/Search Specification] LIKE '*$OBJ_NAME*') AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y' AND [GParent Inactive] <> 'Y'",
                fields: "Name,Type,Business Component,Business Component Field,Value/Search Specification,GParent Name,Parent Name,Comments",
                xfield: "Business Component Field"
            }
        },
        script: {
            "Repository Script": {
                query: "([Script] LIKE '*FieldValue*(*\"$OBJ_NAME\"*)*') AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,Parent Name,Script,Comments",
                xfield: "Script"
            }
        }
    },
    "Integration Object": {
        search: {
            bc: "Repository Integration Object",
            query: "[Inactive]<>'Y' AND [Name] ~LIKE '$OBJ_NAME*'",
            fields: "Name"
        },
        ref: {
            "EAI Data Map": {
                bc: "EAI Object Map",
                query: "[Destination Object Name]='$OBJ_NAME' OR [Source Object Name]='$OBJ_NAME'",
                fields: "Name,Source Object Name,Destination Object Name",
                xfield: "Source/Dest Object"
            },
            "Workflow Step": {
                //custom BC (copy of vanilla) needed because vanilla bc has slash in the name
                bc: "BCRM Repository WF Step IO Argument",
                query: "[Value/Search Specification] LIKE '*$OBJ_NAME*' AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y' AND [GParent Inactive] <> 'Y'",
                fields: "Name,Type,Value/Search Specification,GParent Name,Parent Name,Comments",
                xfield: "Value/Search Specification"
            }
        }
    },
    "LOV Type": {
        search: {
            bc: "List Of Values",
            query: "[Active]='Y' AND [Inactive] <> 'Y' AND [Type]='LOV_TYPE' AND [Value] ~LIKE '$OBJ_NAME*'",
            fields: "Value"
        },
        ref: {
            "Applet Search Specification": {
                bc: "Repository Applet",
                query: "[Search Specification] LIKE '*LookupValue*' AND [Search Specification] LIKE '*$OBJ_NAME*' AND [Inactive] <> 'Y'",
                fields: "Name,Search Specification,Comments",
                xfield: "Search Specification"
            },
            "BC Search Specification": {
                bc: "Repository Business Component",
                query: "[Search Specification] LIKE '*LookupValue*' AND [Search Specification] LIKE '*$OBJ_NAME*' AND [Inactive] <> 'Y'",
                fields: "Name,Search Specification,Comments",
                xfield: "Search Specification"
            },
            "Data Validation Rule": {
                bc: "FINS Validation Rule",
                query: "[Expression] LIKE '*LookupValue*' AND [Expression] LIKE '*$OBJ_NAME*' AND ([End Date] IS NULL OR [End Date] > Today())",
                fields: "Name,Err Msg Text,Expression,Rule Set Id,Business Component,Apply To Type,Description,End Date",
                xfield: "Expression"
            },
        },
        script: {
            "Repository Script": {
                query: "([Script] LIKE '*LookupValue*\"$OBJ_NAME\"*') AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,Parent Name,Script,Comments",
                xfield: "Script"
            }
        }
    },
    "Manifest File": {
        search: {
            bc: "UI Files",
            query: "[Name] ~LIKE '*$OBJ_NAME*' AND [Is Inactive] <> 'Y' AND [Name] NOT LIKE '3rdParty*' AND [Name] LIKE '*.js'",
            fields: "Name"
        },
        ref: {
            "Custom Files by Object": {
                bc: "UI Object",
                query: "[UI File Names] LIKE '*$OBJ_NAME*' AND [Siebel Internal Read Only] <> 'Y' AND [Is Inactive] <> 'Y'",
                fields: "Name,UI File Names,Type Cd,Usage Type Cd",
                xfield: "UI File Names"
            },
            "All Files by Object": {
                bc: "UI Object",
                query: "[UI File Names] LIKE '*$OBJ_NAME*' AND [Is Inactive] <> 'Y'",
                fields: "Name,UI File Names,Type Cd,Usage Type Cd",
                xfield: "UI File Names"
            },
            "Manifest File JS": {
                bc: "UI Files",
                query: "[Name] LIKE '*$OBJ_NAME*' AND [Is Inactive] <> 'Y' AND [Name] NOT LIKE '3rdParty*' AND [Name] LIKE '*.js'",
                fields: "Name",
                xfield: "Name"
            }
        }
    },
    "Profile Attribute": {
        ref: {
            "Manifest Expression": {
                bc: "UI Object Expression",
                query: "[Expression] LIKE '*ProfileAttr*(*\"$OBJ_NAME\"*)*' AND [Is Inactive] <> 'Y' AND [IsExpInactive] <> 'Y'",
                fields: "Siebel Internal Read Only,Expression,Child Count,Group Name,Level Num,UI Object Name,Ui Expr Name",
                xfield: "Expression"
            },
            "Applet Web Template Item": {
                bc: "Repository Applet Web Template Item",
                query: "[Expression] LIKE '*ProfileAttr*(*\"$OBJ_NAME\"*)*' AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y' AND [GParent Inactive] <> 'Y'",
                fields: "Expression,Name,Web Tmpl Name,Item Identifier,GParent Name,Comments",
                xfield: "Expression"
            }
        },
        script: {
            "Repository Script": {
                query: "([Script] LIKE '*ProfileAttr*(*\"$OBJ_NAME\"*)*') AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,Parent Name,Script,Comments",
                xfield: "Script"
            },
            "Open UI JS": {
                keywords: ["ProfileAttr"],
                xfield: "Script"
            }
        }
    },
    "Table": {
        search: {
            bc: "Repository Table",
            query: "[Inactive]<>'Y' AND [Name] ~LIKE '$OBJ_NAME*'",
            fields: "Name"
        },
        ref: {
            "Base Table": {
                bc: "Repository Business Component",
                query: "[Table]='$OBJ_NAME' AND [Inactive] <> 'Y'",
                fields: "Name,Table,Comments",
                xfield: "Table"
            },
            "Join": {
                bc: "Repository Join",
                query: "[Table]='$OBJ_NAME' AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,Table,Parent Name,Comments",
                xfield: "Table"
            }
        }
    },
    "View": {
        search: {
            bc: "Repository View",
            query: "[Inactive]<>'Y' AND [Name] ~LIKE '$OBJ_NAME*'",
            fields: "Name"
        },
        ref: {
            "Responsibility": {
                //Needs custom BC as denormalized view on S_APP_VIEW_RESP
                bc: "BCRM Responsibility View",
                query: "[View Name]='$OBJ_NAME'",
                fields: "View Name,Responsibility Name",
                xfield: "View Name"
            },
            "Applet Drilldown": {
                bc: "Repository Drilldown Object",
                query: "[View]='$OBJ_NAME' AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,View,Hyperlink Field,Parent Name,Comments",
                xfield: "View"
            },
            "Screen": {
                bc: "Repository Screen View",
                query: "[View]='$OBJ_NAME' AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,View,Category,Parent Name,Comments",
                xfield: "View"
            },
            "Workflow User Interact": {
                bc: "Repository WF Step",
                query: "[User Interact View]='$OBJ_NAME' AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,User Interact View,Parent Name,Comments",
                xfield: "User Interact View"
            }
        },
        script: {
            "Repository Script": {
                query: "([Script] LIKE '*GotoView*(*\"$OBJ_NAME\"*)*') AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,Parent Name,Script,Comments",
                xfield: "Script"
            },
            "Open UI JS": {
                keywords: ["View", "view"],
                xfield: "Script"
            }
        }
    },
    "Workflow Process": {
        search: {
            bc: "Repository Workflow Process",
            query: "[Inactive]<>'Y' AND [Process Name] ~LIKE '$OBJ_NAME*'",
            fields: "Process Name"
        },
        ref: {
            "Job Template": {
                bc: "Component Job Parameter",
                query: "[Value] LIKE '$OBJ_NAME'",
                fields: "Name,Value,Parameter Code,Component Job Id",
                xfield: "Value"
            },
            "Applet User Property": {
                bc: "Repository Applet User Prop",
                query: "([Value] LIKE '*Workflow Process*' AND [Value] LIKE '*$OBJ_NAME*') AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,Parent Name,Comments,Value",
                xfield: "Value"
            },
            "BC User Property": {
                bc: "Repository Business Component User Prop",
                query: "([Value] LIKE '*Workflow Process*' AND [Value] LIKE '*$OBJ_NAME*') AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,Parent Name,Comments,Value",
                xfield: "Value"
            },
            "Workflow Sub Process": {
                bc: "Repository WF Step",
                query: "[Subprocess Name]='$OBJ_NAME' AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,Subprocess Name,Parent Name,Comments",
                xfield: "Subprocess Name"
            },
            "Workflow Policy Action": {
                bc: "Workflow Action Argument",
                query: "[Default Value]='$OBJ_NAME'",
                fields: "Default Value,Action Program Id,Action Id",
                xfield: "Default Value"
            }
        },
        ent: {
            "EAI Data Handling Subsystem": {
                ot: "Workflow Process",
                function: BCRMGetEntProfileParamsQuery,
                label: "EAI Data Handling Subsystem",
                query: "[SS_ALIAS]='EAITransportDataHandlingSubsys' AND [PA_ALIAS]='DispatchWorkflowProcess' AND [PA_VALUE]='$OBJ_NAME'",
                fields: "PA_ALIAS,PA_VALUE,PA_DEFAULT_VAL,PA_VISIBILITY",
                xfield: "PA_VALUE"
            }
        },
        script: {
            "Repository Script": {
                query: "([Script] LIKE '*Workflow Process*' AND [Script] LIKE '*\"$OBJ_NAME\"*') AND [Inactive] <> 'Y' AND [Parent Inactive] <> 'Y'",
                fields: "Name,Parent Name,Script,Comments",
                xfield: "Script"
            },
            "Open UI JS": {
                keywords: ["Workflow Process"],
                xfield: "Script"
            }
        }
    }
};

BCRMRepoScan = function (ot, on, wsn, wsv, opt = { silent: false }) {
    devpops_debug ? console.log(Date.now(), "BCRMRepoScan") : 0;
    //refresh cache
    if (!opt.silent) {
        BCRM_REPO_SCAN_CACHE = [];
    }
    //workspace
    if (typeof (wsn) === "undefined") {
        devpops_debug ? console.log(Date.now(), "Calling BCRMGetWSContext from BCRMRepoScan") : 0;
        BCRMGetWSContext();
        wsn = sessionStorage.BCRMCurrentWorkspace;
        wsv = sessionStorage.BCRMCurrentWorkspaceVersion;
    }

    if (typeof (BCRM_REPO_SCAN_CFG[ot]) !== "undefined") {
        let ref = BCRM_REPO_SCAN_CFG[ot].ref;
        let script;
        if (typeof (BCRM_REPO_SCAN_CFG[ot].script) !== "undefined") {
            script = BCRM_REPO_SCAN_CFG[ot].script;
        }
        let ent;
        if (typeof (BCRM_REPO_SCAN_CFG[ot].ent) !== "undefined") {
            ent = BCRM_REPO_SCAN_CFG[ot].ent;
        }
        let defaults = BCRM_REPO_SCAN_CFG.defaults;

        //look for references
        for (r in ref) {
            let rdef = ref[r];
            BCRMRepoScanFetchData(wsn, wsv, rdef, r, on, ot, opt);
        }
        //scan scripts
        if (typeof (script) !== "undefined") {
            for (s in script) {
                if (s == "Repository Script") {
                    let bc_list = defaults[s].bc;
                    for (let i = 0; i < bc_list.length; i++) {
                        let sdef = script[s];
                        sdef.bc = bc_list[i];
                        BCRMRepoScanFetchData(wsn, wsv, sdef, sdef.bc, on, ot, opt);
                    }
                }
                if (s == "Open UI JS") {
                    let label = r;
                    BCRMRepoScanOUIJS(on, ot, s);
                }
            }
        }
        if (typeof (ent) !== "undefined") {
            for (e in ent) {
                let cfg = ent[e];
                cfg.function(cfg, on);
            }
        }
    }
};

BCRMRepoScanOUIJS = function (on, ot, label) {
    devpops_debug ? console.log(Date.now(), "BCRMRepoScanOUIJS") : 0;
    let timer = 10000;
    if (typeof (BCRM_REPO_SCAN_CACHE[label]) === "undefined") {
        BCRM_REPO_SCAN_CACHE[label] = [];
    }
    BCRMRepoScanShowResults(label, ot, on, true);
    if (typeof (BCRM_REPO_SCAN_MANIFEST_FILES) === "undefined") {
        BCRMToast("Loading Open UI JS Files. Please stand by.", "primary", "info-circle", 10000);
        BCRMRepoScan("Manifest File", "*", undefined, undefined, { silent: true });
    }
    else {
        if ($.isEmptyObject(BCRM_REPO_SCAN_MANIFEST_FILES)) {
            BCRMToast("Loading Open UI JS Files. Please stand by.", "primary", "info-circle", 10000);
            BCRMRepoScan("Manifest File", "*", undefined, undefined, { silent: true });
        }
        else {
            timer = 1;
        }
    }

    setTimeout(function () {
        BCRMRepoScanProcessOUIJS(on, ot, label);
        BCRMRepoScanShowResults(label, ot, on);
    }, timer);
};

BCRMRepoScanFetchData = function (wsn, wsv, rdef, label, on, ot, opt = { silent: false }, srownum = 0) {
    devpops_debug ? console.log(Date.now(), "BCRMRepoScanFetchData") : 0;
    let myHeaders = new Headers();
    //myHeaders.append("Authorization", "Basic U0FETUlOOldlbGNvbWUx");
    var pagesize = 100;

    var bc = rdef.bc;
    var xfield = rdef.xfield;

    if (typeof (BCRM_REPO_SCAN_CACHE[label]) === "undefined") {
        BCRM_REPO_SCAN_CACHE[label] = [];
    }
    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    let searchspec = rdef.query.replaceAll("$OBJ_NAME", on);
    let fields = rdef.fields;

    //Requires BO "BCRM Repository Details" and Base IO
    let url = location.origin + "/siebel/v1.0/data/BCRM Repository Details/Repository Repository/*/" + bc + "?fields=" + fields + "&searchspec=" + searchspec + "&PageSize=" + pagesize + "&pagination=Y&StartRowNum=" + srownum + "&workspace=" + wsn + "&version=" + wsv + "&childlinks=None&uniformresponse=y";
    if (!opt.silent) {
        BCRMRepoScanShowResults(label, ot, on, true);
    }
    fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {
            let res = JSON.parse(result);
            if (typeof (res.items) !== "undefined") {
                let items = res.items;

                if (label.indexOf("Script") > -1) {
                    items = BCRMRepoScanProcessScript(items, on, ot);
                }

                BCRMRepoScanProcessExportData(items, on, ot, label, xfield);

                if (label == "Manifest File JS") {
                    for (let f = 0; f < items.length; f++) {
                        BCRMRepoScanProcessMFJS(label, ot, on, items[f], opt);
                    }
                }

                if (label != "Manifest File JS") {
                    BCRM_REPO_SCAN_CACHE[label].push(...items);
                }
                if (!opt.silent) {
                    BCRMRepoScanShowResults(label, ot, on);
                }
                //pagination
                let links = res.Link;
                for (let i = 0; i < links.length; i++) {
                    if (links[i].rel == "nextSet") {
                        BCRMRepoScanFetchData(wsn, wsv, rdef, label, on, ot, opt, srownum + pagesize);
                        break;
                    }
                }
            }
            else {
                //no results
                if (!opt.silent) {
                    BCRMRepoScanShowResults(label, ot, on);
                }
            }
        })
        .catch(error => {
            //console.log('error', error);
        });
};

BCRMRepoScanShowResults = function (label, ot, on, init = false) {
    devpops_debug ? console.log(Date.now(), "BCRMRepoScanShowResults") : 0;
    if ($("#bcrm_reposcan_results").length == 1) {
        let items = BCRM_REPO_SCAN_CACHE[label];
        let l = items.length;
        let card;
        let counter = l + " hit" + (l == 1 ? "" : "s");
        if (init) {
            counter = $("<sl-spinner style='--speed:4s'></sl-spinner>");
        }
        let card_content = $("<div class='bcrm-reposcan-card-content'>");
        if ($("#bcrm_reposcan_results").find("[bcrm-label='" + label + "']").length == 0) {
            card = $("<div bcrm-label='" + label + "'>");
            card = $("<sl-card style='margin:8px;' bcrm-label='" + label + "'><div slot='header'><strong>" + label + "</strong></div><div class='bcrm-reposcan-card-footer' slot='footer'></div></sl-card>");
            card.append(card_content);
            $("#bcrm_reposcan_results").append(card);
        }
        else {
            card = $("#bcrm_reposcan_results").find("[bcrm-label='" + label + "']");
        }
        if (init) {
            card.find(".bcrm-reposcan-card-content").append(counter);
        }
        else {
            card.find(".bcrm-reposcan-card-content").text(counter);
        }

        if (l > 0) {
            if (card.find(".bcrm-reposcan-card-details-btn").length == 0) {
                let fbtn = $("<sl-button class='bcrm-reposcan-card-details-btn' variant='primary' outline pill size='small'>Details</sl-button>");
                fbtn[0].addEventListener("click", () => {
                    BCRMRepoScanPopDetails(label, ot, on);
                });
                card.find(".bcrm-reposcan-card-footer").append(fbtn);
            }
        }
    }
};

BCRMRepoScanPopExportData = function () {
    devpops_debug ? console.log(Date.now(), "BCRMRepoScanPopExportData") : 0;
    let dlg = $("<sl-dialog style='--width:90vw;' id='bcrm_reposcan_export_dlg' label='" + "Data Export" + "'><sl-button class='dlg-close-btn' slot='footer' variant='primary'>Close</sl-button></sl-dialog>");
    const closeButton = dlg[0].querySelector('sl-button.dlg-close-btn');
    closeButton.addEventListener('click', () => $("#bcrm_reposcan_export_dlg").remove());
    let cont = $("<div style='overflow:auto'>");
    let table = BCRM_REPO_SCAN_HTML;
    table.css({
        "font-size": "10px"
    });
    cont.append(table);
    dlg.append(cont);
    $("#bcrm_reposcan_export_dlg").remove();
    $("body").append(dlg);
    $("#bcrm_reposcan_export_dlg")[0].show();

    var el = $("#bcrm_reposcan_export_dlg").find("table")[0];

    //copy to clipboard
    var body = document.body, range, sel;
    if (document.createRange && window.getSelection) {
        range = document.createRange();
        sel = window.getSelection();
        sel.removeAllRanges();
        try {
            range.selectNodeContents(el);
            sel.addRange(range);
        } catch (e) {
            range.selectNode(el);
            sel.addRange(range);
        }
        document.execCommand("copy");
        BCRMToast("Data copied to clipboard 1");

    } else if (body.createTextRange) {
        range = body.createTextRange();
        range.moveToElementText(el);
        range.select();
        range.execCommand("Copy");
        BCRMToast("Data copied to clipboard 2");
    }

};

BCRMRepoScanPopDetails = function (label, ot, on) {
    devpops_debug ? console.log(Date.now(), "BCRMRepoScanPopDetails") : 0;
    let title = label + " definitions with references to " + ot + " [" + on + "]";
    let dlg = $("<sl-dialog style='--width:90vw;' id='bcrm_reposcan_details_dlg' label='" + title + "'><sl-button class='dlg-close-btn' slot='footer' variant='primary'>Close</sl-button></sl-dialog>");
    const closeButton = dlg[0].querySelector('sl-button.dlg-close-btn');
    closeButton.addEventListener('click', () => $("#bcrm_reposcan_details_dlg").remove());
    let list = $("<div id='bcrm_reposcan_details_container'>");
    var p;
    var card;
    let items = BCRM_REPO_SCAN_CACHE[label];
    BCRMInjectCSS("reposcanpop01", "#bcrm_repo_scan_script{max-height:90vh!important;}");
    for (let i = 0; i < items.length; i++) {
        card = $("<sl-card></sl-card>");
        card.css({
            "width": "100%",
            "font-size": "0.8em",
            "line-height": "0.4",
            "margin-bottom": "4px"
        });
        let item = items[i];
        for (d in item) {

            if (d == "Insight") {
                p = $("<div><hr><p><strong>Script Insight</strong></p><p>" + "Script Status" + ": " + item[d]["Status"] + "</p><div>");
                for (let la = 0; la < item[d]["Active Lines"].length; la++) {
                    p.append("<p style='line-height:1.2;font-family:monospace;'>" + item[d]["Active Lines"][la] + "</p>");
                }
                for (let li = 0; li < item[d]["Inactive Lines"].length; li++) {
                    p.append("<p style='line-height:1.2;font-family:monospace;'>" + item[d]["Inactive Lines"][li] + "</p>");
                }
            }
            else if (d == "Link") {
                //TBD (Links are REST "self" etc response links)
            }
            else if (d == "Script") {
                p = $("<sl-button title='Show Script Code' size='small'>Script</sl-button>");
                p[0].addEventListener("click", () => {
                    let sc = $("<div id='bcrm_repo_scan_script' style='overflow:scroll;max-height:90vh!important;'></div>");
                    let scr = $("<pre style='line-height:1.2;font-family:monospace;'>");
                    scr.text(item["Script"]);
                    sc.append(scr);
                    sc.dialog({
                        title: label,
                        width: "90vw"
                    });
                });
            }
            else {
                p = $("<p style='line-height:1.2;'>" + d + ": " + item[d] + "</p>");
            }
            card.append(p);
        }
        list.append(card);
    }

    dlg.append(list);
    $("#bcrm_reposcan_details_dlg").remove();
    $("body").append(dlg);
    $("#bcrm_reposcan_details_dlg")[0].show();
};

var BCRM_REPO_SCAN_HTML;
BCRMRepoScanProcessExportData = function (items, on, ot, label, xfield) {
    devpops_debug ? console.log(Date.now(), "BCRMRepoScanProcessExportData") : 0;
    //let cfg = BCRM_REPO_SCAN_CACHE[ot];
    let cols = ["Object Type", "Object Name", "Referenced By OT", "Referenced By ON", "Root Object Name", "Reference", "Comments"];
    //let noref = ["Name", "Parent Name", "GParent Name", "Link", "Id", "Comments", "Insight", "GParent BO"];
    if (typeof (BCRM_REPO_SCAN_HTML) === "undefined") {
        let table = $("<table>");
        let hd = $("<tr>");
        for (let c = 0; c < cols.length; c++) {
            let htd = $("<td style='border:1px solid lightgrey;'>" + cols[c] + "</td>");
            hd.append(htd);
        }
        table.append(hd);
        BCRM_REPO_SCAN_HTML = table;
    }

    for (let i = 0; i < items.length; i++) {
        let row = $("<tr>");
        let c1 = $("<td style='border:1px solid lightgrey;'>" + ot + "</td>");
        let c2 = $("<td style='border:1px solid lightgrey;'>" + on + "</td>");
        let c3 = $("<td style='border:1px solid lightgrey;'>" + label + "</td>");
        let name = items[i]["Name"];
        if (typeof (name) === "undefined") {
            if (typeof (items[i]["Responsibility Name"]) !== "undefined") {
                name = items[i]["Responsibility Name"];
            }
        }
        let c4 = $("<td style='border:1px solid lightgrey;'>" + name + "</td>");
        let c5 = $("<td style='border:1px solid lightgrey;'></td>");
        if (typeof (items[i]["Parent Name"]) !== "undefined") {
            c5.text(items[i]["Parent Name"]);
        }
        if (typeof (items[i]["GParent Name"]) !== "undefined") {
            c5.text(items[i]["GParent Name"]);
        }
        let c6 = $("<td style='border:1px solid lightgrey;'></td>");
        c6.text(xfield);
        let c7 = $("<td style='border:1px solid lightgrey;'></td>");
        if (typeof (items[i]["Comments"]) !== "undefined") {
            c7.text(items[i]["Comments"]);
        }
        row.append(c1);
        row.append(c2);
        row.append(c3);
        row.append(c4);
        row.append(c5);
        row.append(c6);
        row.append(c7);
        BCRM_REPO_SCAN_HTML.append(row);
    }
};

BCRMRepoScanProcessOUIJS = function (on, ot, label) {
    devpops_debug ? console.log(Date.now(), "BCRMRepoScanProcessOUIJS") : 0;
    //TODO: Handle comments and minified code
    var insight;
    var active = 0;
    var insideblock = false;
    var item = {};
    var s_on = "\"" + on + "\"";
    var kwds = BCRM_REPO_SCAN_CFG[ot]["script"]["Open UI JS"]["keywords"];
    let files = BCRM_REPO_SCAN_MANIFEST_FILES;
    let script = "";
    for (f in files) {
        insight = {
            "Status": "",
            "Lookup Object Type": ot,
            "Lookup Object Name": on,
            "Active Lines": [],
            "Inactive Lines": []
        };
        script = files[f]["Script"];
        for (let i = 0; i < kwds.length; i++) {
            if (script.indexOf(kwds[i]) > -1) {
                if (script.indexOf(s_on) > -1) {
                    item = files[f];
                    insight["Status"] = "Found keyword " + kwds[i];
                    insight["Lookup Object Type"] = ot;
                    insight["Lookup Object Name"] = on;
                    insight["Active Lines"].push(script.substring(script.indexOf(s_on) - 20, script.indexOf(s_on) + s_on.length + 20));
                    item["Insight"] = insight;
                    BCRM_REPO_SCAN_CACHE[label].push(item);
                }
            }
        }
    }
};

BCRMRepoScanProcessScript = function (items, on, ot) {
    //TODO: Use regex from REPO_SCAN_CFG query to identify matching lines
    devpops_debug ? console.log(Date.now(), "BCRMRepoScanProcessScript") : 0;
    //Goal: parse script (e.g. object could be inside a comment)
    //TODO: Can do better with false positives
    var insight;
    var keepers = [];
    var active = 0;
    var insideblock = false;
    var s_on = ["\"" + on + "\""];
    if (ot == "Business Component") {
        s_on = ["BusComp", "\"" + on + "\""];
    }
    if (ot == "Field") {
        s_on = ["FieldValue", "\"" + on + "\""];
    }
    for (let i = 0; i < items.length; i++) {
        insight = {
            "Status": "",
            "Lookup Object Type": ot,
            "Lookup Object Name": on,
            "Active Lines": [],
            "Inactive Lines": []
        };
        let script = items[i]["Script"];
        let lines = script.split("\n");
        active = 0;
        insideblock = false;
        for (let l = 0; l < lines.length; l++) {
            //single line comments
            if (!insideblock) {
                if (lines[l].indexOf("//") > -1) {
                    let cidx = lines[l].indexOf("//");
                    for (let i1 = 0; i1 < s_on.length; i1++) {
                        if (lines[l].indexOf(s_on[i1]) > cidx) {
                            //object in a single line comment
                            i1 + 1 == s_on.length ? insight["Inactive Lines"].push("[" + l + "]_COMMENT_LINE: " + lines[l]) : 0;
                        }
                    }
                }
                //block comments
                else if (lines[l].indexOf("/*") > -1) {
                    insideblock = true;
                    let bidx = lines[l].indexOf("/*");
                    for (let i2 = 0; i2 < s_on.length; i2++) {
                        if (lines[l].indexOf(s_on[i2]) > bidx) {
                            //object in a block comment
                            i2 + 1 == s_on.length ? insight["Inactive Lines"].push("[" + l + "]_COMMENT_BLOCK: " + lines[l]) : 0;
                        }
                    }
                }
                else {
                    if (!insideblock) {
                        for (let i3 = 0; i3 < s_on.length; i3++) {
                            if (lines[l].indexOf(s_on[i3]) > -1) {
                                //object in active code
                                i3 + 1 == s_on.length ? insight["Active Lines"].push("[" + l + "]_ACTIVE_CODE: " + lines[l]) : 0;
                                i3 + 1 == s_on.length ? active++ : 0;
                            }
                        }
                    }
                }
            }
            if (insideblock) {
                for (let i4 = 0; i4 < s_on.length; i4++) {
                    if (lines[l].indexOf(s_on[i4]) > -1) {
                        //object in a block comment
                        i4 + 1 == s_on.length ? insight["Inactive Lines"].push("[" + l + "]_COMMENT_BLOCK: " + lines[l]) : 0;
                    }
                }
                if (lines[l].indexOf("*/") > -1) {
                    //end of block comment
                    let eidx = lines[l].indexOf("*/");
                    for (let i5 = 0; i5 < s_on.length; i5++) {
                        if (lines[l].indexOf(s_on[i5]) > -1 && lines[l].indexOf(s_on[i5]) < eidx) {
                            //object in a block comment
                            i5 + 1 == s_on.length ? insight["Inactive Lines"].push("[" + l + "]_COMMENT_BLOCK: " + lines[l]) : 0;
                        }
                    }
                    insideblock = false;
                }
            }
        }//end for each line
        if (active > 0) {
            insight["Status"] = "Active";
        }
        else {
            insight["Status"] = "Inactive";
        }
        items[i]["Insight"] = insight;
        keepers.push(items[i]);
    }//end for each script
    return keepers;
};

BCRMRepoScanClear = function () {
    devpops_debug ? console.log(Date.now(), "BCRMRepoScanClear") : 0;
    BCRM_REPO_SCAN_HTML = undefined;
    BCRM_REPO_SCAN_CACHE = [];
    BCRM_REPO_SCAN_MANIFEST_FILES = {};
    BCRM_ENTPROFILES = [];
    $("#bcrm_reposcan_results").empty();
    BCRMToast("Dependency Finder clean-up complete.");
};

/*
BCRMRepoScanWarmUp = function () {
    devpops_debug ? console.log(Date.now(), "BCRMRepoScanWarmUp") : 0;
    setTimeout(function () {
        BCRMGetEntProfileParamsQuery(BCRM_REPO_SCAN_CFG["Business Service"]["ent"]['EAI Data Handling Subsystem'], "EAI Siebel Adapter");
    }, 100);
    setTimeout(function () {
        BCRMRepoScan("Manifest File", "*");
        BCRMToast("Web Files/Manifest Warm-up complete.");
    }, 100);
};
*/
BCRMRepoScanGetList = function (ot, on) {
    devpops_debug ? console.log(Date.now(), "BCRMRepoScanGetList") : 0;
    $("sl-menu.bcrm-auto").remove();
    let sc = BCRM_REPO_SCAN_CFG[ot].search;
    var t = [];
    if (typeof (sc) !== "undefined") {
        BCRMGetWSContext();
        var ws = sessionStorage.BCRMCurrentWorkspace;
        var ver = sessionStorage.BCRMCurrentWorkspaceVersion;
        var searchspec = sc.query.replaceAll("$OBJ_NAME", on);
        var nf = sc.fields.split(",")[0];
        var url = location.origin + "/siebel/v1.0/data/BCRM Repository Details/Repository Repository/*/" + sc.bc + "?fields=" + sc.fields + "&searchspec=" + searchspec + "&workspace=" + ws + "&childlinks=None&uniformresponse=y&version=" + ver;
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.text())
            .then(result => {
                let res = JSON.parse(result);
                if (typeof (res.items) !== "undefined") {
                    let items = res.items;
                    let m = $("<sl-menu class='bcrm-auto'>");
                    for (i in items) {
                        let val = items[i][nf];
                        if (typeof (val) !== "undefined") {
                            //dedup
                            if (t.indexOf(val) == -1) {
                                t.push(val);
                                let mi = $("<sl-menu-item value='" + val + "'>" + val + "</sl-menu-item>");
                                m.append(mi);
                            }
                        }
                    }
                    if (m.find("sl-menu-item").length > 0) {
                        m[0].addEventListener("sl-select", event => {
                            let selectedItem = event.detail.item;
                            let on = selectedItem.cachedTextLabel;
                            $("#bcrm_reposcan_on").val(on);
                            $("sl-menu.bcrm-auto").remove();
                        });
                        if ($("sl-menu.bcrm-auto").length == 0) {
                            $("#bcrm_reposcan_on").after(m);
                        }
                    }
                }
            })
            .catch(error => {
                //do nothing
            });
    }
};

BCRMRepoScanUI = function () {
    devpops_debug ? console.log(Date.now(), "BCRMRepoScanUI") : 0;
    let cfg = BCRM_REPO_SCAN_CFG;
    let types = [];
    for (c in cfg) {
        if (c != "defaults") {
            types.push(c);
        }
    }
    let dlg = $("<sl-dialog style='--width: 90vw;' id='bcrm_reposcan' label='" + "🏬 devpops Dependency Finder" + "'><sl-button class='dlg-close-btn' slot='footer' variant='primary'>Close</sl-button></sl-dialog>");
    const closeButton = dlg[0].querySelector('sl-button.dlg-close-btn');
    closeButton.addEventListener('click', () => $("#bcrm_reposcan").remove());
    let content = $("<div id='bcrm_reposcan_content' style='width:85vw;height:75vh;overflow:auto;'>");
    let combo = $("<sl-dropdown label='Select Object Type'><sl-button id='bcrm_ot_btn' slot='trigger' caret>Object Type</sl-button></sl-dropdown>");
    let menu = $("<sl-menu></sl-menu>");
    for (let i = 0; i < types.length; i++) {
        let mi = $("<sl-menu-item value='" + types[i].replaceAll(" ", "_") + "'>" + types[i] + "</sl-menu-item>")
        menu.append(mi);
    }
    combo.append(menu);
    combo[0].addEventListener('sl-select', event => {
        const selectedItem = event.detail.item;
        let ot = selectedItem.cachedTextLabel;
        $("#bcrm_ot_btn").text(ot);
        $("#bcrm_reposcan_on").val("");
        $("#bcrm_reposcan_on").attr("list", ot);
    });
    content.append(combo);

    let on = $("<sl-input id='bcrm_reposcan_on' style='margin-top:10px;width:40vw;' label='Object Name' clearable></sl-input>");
    on[0].addEventListener("keyup", event => {
        var me = $(event.target);
        var val = me.val();
        if (val.length <= 2) {
            $("sl-menu.bcrm-auto").remove();
        }
        if (val.length >= 4) {
            $("sl-menu.bcrm-auto sl-menu-item").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(val.toLowerCase()) > -1)
            });
        }
        if (val.length == 3) {
            $("sl-menu.bcrm-auto").remove();
            BCRMRepoScanGetList(me.attr("list"), val);
        }
    });
    content.append(on);

    let srchbtn = $("<sl-button style='margin-top:10px;margin-right:10px;' variant='primary'>Find Dependencies</sl-button>");
    srchbtn[0].addEventListener("click", () => {
        let ot = $("#bcrm_ot_btn").text();
        let on = $("#bcrm_reposcan_on").val();
        $("#bcrm_reposcan_results").empty();
        BCRMRepoScan(ot, on);
    });
    content.append(srchbtn);

    /*
    let wrmbtn = $("<sl-button style='margin-top:10px;margin-right:10px;' variant='primary'>Warm Up</sl-button>");
    wrmbtn[0].addEventListener("click", () => {
        BCRMRepoScanWarmUp();
    });
    content.append(wrmbtn);
    */

    let expbtn = $("<sl-button style='margin-top:10px;margin-right:10px;' variant='primary'>Data Export</sl-button>");
    expbtn[0].addEventListener("click", () => {
        BCRMRepoScanPopExportData();
    });
    content.append(expbtn);

    let clrbtn = $("<sl-button style='margin-top:10px;margin-right:10px;' variant='primary'>Tidy Up</sl-button>");
    clrbtn[0].addEventListener("click", () => {
        BCRMRepoScanClear();
    });
    content.append(clrbtn);

    let results = $("<div id='bcrm_reposcan_results' style='display:grid;grid-template-columns:auto auto auto auto'>");
    content.append(results);
    dlg.append(content);
    $("body").append(dlg);
    $("#bcrm_reposcan")[0].show();
};

var BCRM_REPO_SCAN_MANIFEST_FILES = {};
BCRMRepoScanProcessMFJS = function (label, ot, on, item, opt = { silent: false }) {
    devpops_debug ? console.log(Date.now(), "BCRMRepoScanProcessMFJS") : 0;
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    var file = item["Name"];
    var path = location.origin + "/siebel/scripts/" + file;
    fetch(path, requestOptions)
        .then(response => response.text())
        .then(result => {
            item["Script"] = result;
            BCRM_REPO_SCAN_CACHE[label].push(item);
            let fn = file.replaceAll("/", "__");
            BCRM_REPO_SCAN_MANIFEST_FILES[fn] = item;
            if (!opt.silent) {
                BCRMRepoScanShowResults(label, ot, on);
            }
        })
        .catch(error => {
            //do nothing
        });
};
//listeners
try {
    SiebelApp.EventManager.addListner("AppInit", BCRMGetAppInfo, this);
    if (location.pathname.indexOf("webtools") > -1) {
        SiebelApp.EventManager.addListner("postload", BCRMWTHelper, this);
    }
}
catch (e) {
    console.log("Error in BCRM devpops extension for Siebel Web Tools: " + e.toString());
}

//comment above/uncomment below to use a switch, e.g. localStorage
/*
try {
    if (localStorage.DEVPOPS_ENABLE == "TRUE") {
        SiebelApp.EventManager.addListner("AppInit", BCRMGetAppInfo, this);
        if (location.pathname.indexOf("webtools") > -1) {
            SiebelApp.EventManager.addListner("postload", BCRMWTHelper, this);
        }
    }
}
catch (e) {
    console.log("Error in BCRM devpops extension for Siebel Web Tools: " + e.toString());
}
*/
//END devpops postload.js content
