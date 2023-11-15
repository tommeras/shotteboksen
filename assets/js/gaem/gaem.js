var Gaem = (function(module) {
    
    /*
     * Private variables
     */
    var settings = {}; // The current settings
    var settings_old = {}; // The old settings
    var state = false; // False = game is not running, true = fame is running
    var blocked = false; // False = don't start a new game if state changes, true = start a new game right away
    var counter = 0; // The current counter
    var spin = 0; // The value we are waiting for the counter to reach
    var gaemInterval = null; // Holds the interval that updates the counter
    var screenSize = 2000>window.screen.width;


    var sounds = [
        'sounds/airhorn.mp3'
    ];
    
    /*
     * Analyze settings
     */
    var analyzeSettings = function() {

        // Check if we should start or stop
        if (blocked == false && settings.state == true && state == false && settings.names.length > 0) {
            // Start
            start();
        }
        else if (blocked == false && settings.state == false && state == true) {
            // Stop
            stop();
        }
        
        // Check if the new min/max is different than the old ones
        if (typeof settings_old.min !== 'undefined' && (settings_old.min != settings.min || settings_old.max != settings.max)) {
            generateSpinValue();
        }
    };
    
    /*
     * Generate spin value (time for spin)
     */
    var generateSpinValue = function() {
        // Generate the spni value
        spin = Gaem.utilities.randomInt((settings.min * 1000), (settings.max * 1000));
        
        // Debug
        console.log('Next spin @ ' + spin);
    };
    
    /*
     * Stop the gaem
     */
    var stop = function() {
        // Debug
        console.log('Stopping...');
        
        // Reset state
        state = false;
        
        // Clear interval
        clearInterval(gaemInterval);
        
        // Reset counter and spin
        counter = 0;
        spin = 0;
    };
    
    /*
     * Start the gaem
     */
    var start = function() {
        // Debug
        console.log('Starting...');
        
        // Set counter to 0
        counter = 0;
        
        // Set state to true
        state = true;
        
        // Generate next spin
        generateSpinValue();
        
        // Start the counter
        gaemInterval = setInterval(function (scope) {
            // Increase counter
            counter += 20;
            
            // Debug
            if ((counter % 1000) == 0) {
                if (counter >= spin) {
                    console.log('Current = ' + counter + ', next now');
                }
                else {
                    console.log('Current = ' + counter + ', next in ' + (spin - counter));
                }
            }
            
            // Check if we should spin
            if (counter >= spin) {
                // Gogo spin, furst stop interval
                clearInterval(gaemInterval);
                
                // Call spin
                scope.spin();
            }
        }, 20, module);
    };
    
    /*
     * Generate template
     */
    var generateTemplate = function(id, num, index) {
        var names = [];

        // Create array of objects with random names
        if(screenSize){
        for (var i = 0; i <= (num + 30); i++) {
            names.push({name: settings.names[Math.floor(Math.random() * settings.names.length)]});
        }
        
        // Get template
        var template = _.template(
            $( "script.template-spinner" ).html()
        );
        
        // Append template to container
        $('#container').append(template({'names': names, 'id': id}));
        
        // Calculate movement
        var movement = (num * 140) - 70;

        // Calculate random movement
        var dir = Gaem.utilities.randomInt(0, 1);
        var rand = Gaem.utilities.randomInt(0, 30);
        
        if (dir == 0) {
            movement -= rand;
        }
        else {
            movement += rand;
        }
        
        // Fade the spinner in
        $('#spinner_' + id).fadeIn(400);
        
        // Apply the effect
        setTimeout(function(scope, index) {
            var $spinner_container = $('#spinner_' + id + ' ul');
            $spinner_container.css({left: ($spinner_container.position().left - movement)});

            // Scroll sounds
            var clicks_played = 0;
            var click_interval = setInterval(function() {
                // Get current posision
                var current_pos = (Math.floor($spinner_container.position().left) * -1) - 70;
                
                if (current_pos > 0) {
                    // Calculate how many blocks we have moved
                    var blocks_moved = Math.floor(current_pos / 130);

                    // Check if we should play sound
                    if (blocks_moved > clicks_played) {
                        // Increase clicks played
                        clicks_played++;

                        // Play scroll sound
                        var audio = new Audio('sounds/other/scroll.mp3');
                        audio.play();
                    }
                }
            }, 10);
            
            // Fade out all containers
            setTimeout(function() {
                $spinner_container.find('li').not(':eq(' + (num + 2) + ')').css({opacity: 0.25});
            }, 8000);
            
            // Hide the line
            setTimeout(function() {
                 $('#spinner_' + id + ' .line').css({opacity: 0});
            }, 8000);
            
            // Only do this once
            if (index == 0) {
                // Play sound
                setTimeout(function(scope, click_interval) {
                    // Check if we should play sounds
                    if (scope.playSounds()) {
                        // Play random sound
                        var audio = new Audio(scope.getSounds());
                        audio.play();
                    }

                    // Unset interval for clicking sounds
                    clearInterval(click_interval);

                    // Set timeout to start again (15 secs)
                    setTimeout(scope.restart, 15000);
                }, 8000, scope, click_interval);
           }
        }, (1500 + 400), module, index);}
        else{
            for (var i = 0; i <= (num + 10); i++) {
                //for (var i = 0; i <= (num + 30); i++) {
                    names.push({name: settings.names[Math.floor(Math.random() * settings.names.length)]});
                }
                
                // Get template
                var template = _.template(
                    $( "script.template-spinner" ).html()
                );
                
                // Append template to container
                $('#container').append(template({'names': names, 'id': id}));
                
                // Calculate movement
                //var movement = (num * 140) - 70;
                var movement = (num*210)-105;
        
                // Calculate random movement
                var dir = Gaem.utilities.randomInt(0, 1);
                var rand = Gaem.utilities.randomInt(0, 30);
                
                if (dir == 0) {
                    movement -= rand;
                }
                else {
                    movement += rand;
                }
                
                // Fade the spinner in
                $('#spinner_' + id).fadeIn(400);
                
                // Apply the effect
                setTimeout(function(scope, index) {
                    var $spinner_container = $('#spinner_' + id + ' ul');
                    $spinner_container.css({left: ($spinner_container.position().left - movement)});
        
                    // Scroll sounds
                    var clicks_played = 0;
                    var click_interval = setInterval(function() {
                        // Get current posision
                        //var current_pos = (Math.floor($spinner_container.position().left) * -1) - 70;
                        
                        var current_pos = (Math.floor($spinner_container.position().left) * -1) - 105;
                        if (current_pos > 0) {
                            // Calculate how many blocks we have moved
                            //var blocks_moved = Math.floor(current_pos / 130);
                            var blocks_moved = Math.floor(current_pos / 200);
        
                            // Check if we should play sound
                            if (blocks_moved > clicks_played) {
                                // Increase clicks played
                                clicks_played++;
        
                                // Play scroll sound
                                var audio = new Audio('sounds/other/scroll.mp3');
                                audio.play();
                            }
                        }
                    }, 10);
                    
                    // Fade out all containers
                    setTimeout(function() {
                        $spinner_container.find('li').not(':eq(' + (num + 2) + ')').css({opacity: 0.25});
                    }, 8000);
                    
                    // Hide the line
                    setTimeout(function() {
                         $('#spinner_' + id + ' .line').css({opacity: 0});
                    }, 8000);
                    
                    // Only do this once
                    if (index == 0) {
                        // Play sound
                        setTimeout(function(scope, click_interval) {
                            // Check if we should play sounds
                            if (scope.playSounds()) {
                                // Play random sound
                                var audio = new Audio(scope.getSounds());
                                audio.play();
                            }
        
                            // Unset interval for clicking sounds
                            clearInterval(click_interval);
        
                            // Set timeout to start again (15 secs)
                            setTimeout(scope.restart, 15000);
                        }, 8000, scope, click_interval);
                   }
                }, (1500 + 400), module, index); 
        }
    };

    /*
     * Update settings
     */
    module.updateSettings = function(data) {
        // Debug
        if (typeof settings_old.state == 'undefined') {
            console.log('Initial settings loaded');
        }
        else {
            console.log('Settings reloaded');
        }

        // Store old settings
        settings_old = settings;

        // Store settings
        settings = data;

        // Analyze settings
        analyzeSettings();
    };
    
    /*
     * Init function
     */
    module.init = function() {
        // Debug
        console.log('Init...');
        
        // Set underscore.js settings
        _.templateSettings.variable = 'rc';
        
        // Update settings
        module.updateSettings(Gaem.utilities.getSettings());

        // Update every 15 seconds
        setInterval(function() {
            module.updateSettings(Gaem.utilities.getSettings());
        }, 15000);
    };
    
    /*
     * Spinner
     */
    module.spin = function() {
        // Debug
        console.log('Spinning...');
        
        // Set blocked to true
        blocked = true;
        
        // Set default number of spinners
        var spins = 1;
        
        // Check for triple
        if (Gaem.utilities.randomInt(0, 100) <= settings.triple) {
            // Debug
            console.log('Triple spin!');
            
            // Set number of spinners
            spins = 3;
        }
        
        // Check for double
        if (spins == 1 && Gaem.utilities.randomInt(0, 100) <= settings.double) {
            // Debug
            console.log('Double spin!');
            
            // Set number of spinners
            spins = 2;
        }
        
        // Loop and create spins
        for (var i = 0; i < spins; i++) {
            // Generate number of blocks to spin
            var blocks = Gaem.utilities.randomInt(40, 70);
            // Generate random id
            var id = Gaem.utilities.randomString();
            
            // Generate template
            generateTemplate(id, blocks, i);
        }
    };
    
    /*
     * Restart
     */
    module.restart = function() {
        // Debug
        console.log('Restarting...');
        
        // Remove old spins
        $('#container > div').fadeIn(100, function() {
            $(this).remove();
        });
        
        // Unset blocked
        blocked = false;
        
        // Check what settings are saying
        if (settings.state == true) {
            // Start the gaem again
            setTimeout(start, 100);
        }
    };
    
    /*
     * Get auto
     */
    module.getSounds = function() {
        return sounds[Math.floor(Math.random() * sounds.length)]
    };

    /*
     * Check if we should play sounds
     */
    module.playSounds = function() {
        return settings.sounds;
    };
    
    /*
     * Return the module
     */
    return module;
})(Gaem || {});