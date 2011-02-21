(function(winkstart, amplify, undefined) {
	var modules = {}, loading = {};
	
	winkstart.publish     = amplify.publish;
	winkstart.subscribe   = amplify.subscribe;
	winkstart.unsubscribe = amplify.unsubscribe;
	
	winkstart.module = amplify.module;
	amplify.module.constructor = function(args, callback) {
		var completed = 0, THIS = this;
		if ( this.config.templates ) {
			this.templates = {};
			$.each(this.config.templates, function(name, url) {
				completed++;
				$.get('module/' + THIS.__module + '/' + url, function(template) {
					console.log('Loaded template ' + name + ' at ' + url);
					completed--;
					THIS.templates[name] = $(template);
				}, 'html');
			});
		}
		if ( this.config.requires ) {
			$.each(this.config.requires, function(k, module) {
				completed++;
				amplify.module.load(module, function() {
					console.log('Loaded module: ' + module);
					completed--;
				});
			});
		}
		if ( this.config.css ) {
			$.each(this.config.css, function(k, css) {
				if ( css === true ) {
					THIS.__module + '.css';
				}
				css = 'module/' + THIS.__module + '/' + css;
				//completed++;
				console.log('Loading css: ' + css);
				$('<link href="' + css + '" rel="stylesheet" type="text/css">').bind('load', function() {
					console.log('CSS Loaded');
					//completed--;
				}).appendTo('head');
			});
		}
		if ( this.config.subscribe ) {
			$.each(this.config.subscribe, function(k, v) {
				winkstart.subscribe(k, function() {
					if ( THIS[v] ) {
						THIS[v].apply(THIS, arguments);
					}
				});
			});
		}
		
		setTimeout(function() {
			completed = 0;
		}, 3000);
		
		(function() {
			console.log('completed: ' + completed);
			if ( completed == 0 ) {
				if ( $.isFunction(callback) ) {
					callback();
				}
				return;
			}
			var _c = arguments.callee;
			setTimeout(function() { _c(); }, 10);
		})();
	};
		
	// Bootstrap the app: Start by loading the core module
	winkstart.module.load('core', function() {
		// Currently core doesn't do anything, it will
		
		// Create an instance of the core module
		this.init(function() {
			console.log('Core loaded, loading layout');
			
			// First thing we're going to do is go through is load our layout
			winkstart.module.load('layout', function() {
				this.init({ parent: $('body') }, function() {
					console.log('Layout initialized');
					
					winkstart.module.load('auth', function() {
						this.init();
					});
					winkstart.module.load('dashboard', function() {
						this.init(function() {
							// Activate the dashboard by default (target selector is a hack)
							//winkstart.publish('dashboard.activate', { target: $('#ws-content') });
						});
					});
                                        winkstart.module.load('provisioner', function() {
                                                this.init(function(){
                                                   //winkstart.publish('provisioner.activate', { target: $('#ws-content') });
                                                });
                                        });
                                        winkstart.module.load('callflow', function() {
                                                this.init(function(){
                                                   winkstart.publish('callflow.activate', { target: $('#ws-content') });
                                                });
                                        });
				});
			});
		});
	});

})(	window.winkstart = window.winkstart || {},
	window.amplify = window.amplify || {});