var moment  = require ('moment'),
    sAgent  = require ('superagent');

module.exports = function (RED) {
    "use strict";
    function linky (config) {
        RED.nodes.createNode (this, config);
        this.name   = config.name;
        this.user   = this.credentials.username;
        this.pass   = this.credentials.password;
        this.req    = sAgent.agent();
        this.cookie = null;

        this.getCookie = function (cookieStr, retCookie) {
            linky.status ({fill: 'grey', shape: 'ring', text: 'Checking Credentials...'});
            linky.req
                .post (logUrl)
                .type ('form')
                .send ({
                    IDToken1 : linky.user,
                    IDToken2 : linky.pass,
                    SunQueryParamsString : Buffer.from ("realm=particuliers", 'utf-8').toString ('base64'),
                    encoded : "true",
                    gx_charset : "UTF-8" 
                })
                .end (function (err, res) {
                    if (res.error) return linky.error ('Logging error : ' + res.error + '-' + err.status);
                    var cookies = (res.request.cookies.split(';'));
                    for (var names in cookies) {
                        if (cookieStr.test (cookies[names])) 
                            var mycookie = cookies[names];
                        if (/^iPlanetDirectoryPro/.test (cookies[names])) 
                            var mytoken = cookies[names];
                    }
                    !mytoken || !mycookie ? retCookie (null) : retCookie (mycookie + ';' + mytoken);
                })
        }

        this.getDatas = function (datas) {
            linky.status ({fill: 'green', shape: 'dot', text: 'Fetching datas...'});
            linky.req
                .post (apiUrl)
                .set ('Cookie', linky.cookie)
                .type ('form')
                .send (linky.payload)
                .end (function (err, res) {
                    if (res.error) return linky.error ('Fetching error : ' + res.error + '-' + err.status);
                    datas (JSON.parse (res.text));
                })
        }

        this.payload = {
            p_p_col_pos:        1,
            p_p_lifecycle:      2,
            p_p_col_count:      3,
            p_p_state:          'normal',
            p_p_mode:           'view',
            p_p_cacheability:   'cacheLevelPage',
            p_p_col_id:         'column-1'
        };

        var linky   = this,
            logUrl  = 'https://espace-client-connexion.enedis.fr/auth/UI/Login',
            apiUrl  = 'https://espace-client-particuliers.enedis.fr/group/espace-particuliers/suivi-de-consommation';

        if (!linky.user || !linky.pass) {
            linky.status ({fill: 'red', shape: 'dot', text: 'No Credentials !'})
            return linky.error ('No credentials... Check Username/Password !');
        }

        linky.getCookie (new RegExp ('JSESSIONID'), function (retCookie) {
            linky.warn (retCookie || 'Can\'t get cookie or token !');
            if (!retCookie) return linky.status ({fill: 'red', shape: 'dot', text: 'Logging error !'});
            linky.cookie = retCookie;
            linky.status ({fill: 'yellow', shape: 'ring', text: 'Logged-in successfully'});
        });

        linky.on ('input', function (msg) {
            if (!linky.cookie) return linky.error ("Error : unable to Logged-in !");

            var ppid        = 'lincspartdisplaycdc_WAR_lincspartcdcportlet',
                startDate   = moment(msg.payload.debut, "DD-MM-YYYY"),
                endDate     = moment(msg.payload.fin, "DD-MM-YYYY"),
                diffDate    = endDate.diff (startDate, 'days');

            linky.payload['_' + ppid + '_dateDebut']    = startDate.format("DD/MM/YYYY");
            linky.payload['_' + ppid + '_dateFin']      = endDate.format("DD/MM/YYYY");
            linky.payload['p_p_resource_id']            = 'urlCdcHeure';
            linky.payload['p_p_id']                     = ppid;

            if (diffDate == 0)
                linky.payload['_' + ppid + '_dateFin'] = startDate.add (1, 'd').format ("DD/MM/YYYY");
            else if ((diffDate > 1) && (diffDate < 31))
                linky.payload['p_p_resource_id'] = 'urlCdcJour';
            else if (diffDate > 31)
                linky.payload['p_p_resource_id'] = 'urlCdcMois';

            linky.getDatas (function (datas) {
                msg.payload.linky = datas;
                msg['topic'] = 'linky';
                linky.send (msg);
                linky.status ({fill: 'yellow', shape: 'ring', text: 'Logged-in successfully'});
            });
        });
    }

    RED.nodes.registerType ("Enedis-Linky", linky, {
        credentials: {
            username: {type: "text"},
            password: {type: "password"}
        }
    });
}
