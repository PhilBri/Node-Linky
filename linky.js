module.exports = function (RED) {
    "use strict";
    var moment   = require ('moment');
    const sAgent = require ('superagent');

    function linky (config) {
        var logUrl  = 'https://espace-client-connexion.enedis.fr/auth/UI/Login',
            apiUrl  = 'https://espace-client-particuliers.enedis.fr/group/espace-particuliers/suivi-de-consommation',
            Payload = {
                p_p_col_pos:        1,
                p_p_lifecycle:      2,
                p_p_col_count:      3,
                p_p_state:          'normal',
                p_p_mode:           'view',
                p_p_cacheability:   'cacheLevelPage',
                p_p_col_id:         'column-1'
            };

        RED.nodes.createNode (this, config);
        this.name   = config.name;
        this.user   = this.credentials.username;
        this.pass   = this.credentials.password;
        this.req    = sAgent.agent ();
        this.cookie = null;

        this.getDatas = function (retDatas) {
            linky.status ({fill: 'green', shape: 'dot', text: 'Fetching datas...'});
            linky.req
                .post (apiUrl)
                .query (Payload)
                .end (function (err, res) {
                    try {
                        retDatas (JSON.parse (res.text));
                    } catch (e) {
                        return (linky.error ('Getting datas error: ' + e));
                    }
                })
        }

        this.getCookie = function (retCookie) {
            linky.status ({fill: 'grey', shape: 'ring', text: 'Checking Credentials...'});
            linky.req
                .post (logUrl)
                .type ('form')
                .send ({
                    IDToken1 : linky.user,
                    IDToken2 : linky.pass,
                    SunQueryParamsString : Buffer.from ("realm=particuliers", 'utf-8').toString ('base64')
                })
                .end (function (err, res) {
                    try {
                        retCookie (linky.cookie = res.headers['set-cookie'][0].split(';')[0]);
                    } catch (e) {
                        return (linky.error ('Getting cookie error: ' + e));
                    }
                })
        }
        var linky = this;

        if (!linky.user || !linky.pass) {
            linky.status ({fill: 'red', shape: 'dot', text: 'No Credentials !'})
            return linky.error ('Wrong credentials... Check Username/Password !');
        }

        linky.getCookie (function (retCookie) {
            linky.warn (retCookie || 'Can\'t get cookie or token !');
            if (!retCookie) return linky.status ({fill: 'red', shape: 'dot', text: 'Logging error !'});
            linky.status ({fill: 'yellow', shape: 'ring', text: 'Logged-in successfully'});
        });

        linky.on ('input', function (msg) {
            if (!linky.cookie) return linky.error ("Error : unable to Logged-in !");

            var ppid        = 'lincspartdisplaycdc_WAR_lincspartcdcportlet',
                startDate   = moment(msg.payload.debut, "DD-MM-YYYY"),
                endDate     = moment(msg.payload.fin, "DD-MM-YYYY"),
                diffDate    = endDate.diff (startDate, 'days');

            Payload['_' + ppid + '_dateDebut']  = startDate.format("DD/MM/YYYY");
            Payload['_' + ppid + '_dateFin']    = endDate.format("DD/MM/YYYY");
            Payload.p_p_resource_id             = 'urlCdcHeure';
            Payload.p_p_id                      = ppid;

            if (diffDate == 0)
                Payload['_' + ppid + '_dateFin'] = startDate.add (1, 'd').format ("DD/MM/YYYY");
            else if ((diffDate > 1) && (diffDate < 31))
                Payload.p_p_resource_id = 'urlCdcJour';
            else if (diffDate > 31)
                Payload.p_p_resource_id = 'urlCdcMois';

            linky.getDatas (function (retDatas) {
                msg.payload.linky = retDatas;
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