// This is the VoIP Services base application
winkstart.module('voip', 'voip', {
        templates: {
                voip: 'voip.html'
        },
        
        subscribe: {
            'voip.activate' : 'activate'
        }
    },
    function() {
        // Loaded - add to nav bar
        winkstart.publish('appnav.add', { 'name' : 'voip' });
    },
    {
        initialized :   false,
        modules :       ['account', 'media', 'device', 'autoattendant', 'callflow', 'cdr'],
        
        activate: function() {
            var THIS = this;
            
            if (!THIS.initialized) {
                // We only initialize once
                THIS.initialized = true;

                winkstart.module.loadPlugin('voip', 'nav', function() {
                    this.init(function() {
                        winkstart.log('VoIP: Initialized Top Navigation');
                        $.each(THIS.modules, function(k, v) {
                            winkstart.module.loadPlugin('voip', v, function() {
                                this.init(function() {
                                    winkstart.log('VoIP: Initialized ' + v);
                                });
                            });
                        });
                    });
                });

                // Display the navbar
                $('#ws-content').empty();
                THIS.templates.voip.tmpl({}).appendTo( $('#ws-content') );

            }   // End initialization of modules

            //winkstart.registerResources(this.config.resources);

            //winkstart.publish('layout.updateLoadedModule', {label: 'Device Management', module: this.__module});

        }
    }
);