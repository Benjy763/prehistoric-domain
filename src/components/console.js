let $ = require('jquery');
AFRAME.registerSystem('console', {
  init: function () {
    const self = this;
    // Tour reference
    this.tour;
    // Vehicule position
    this.trackpos = -216;
    this.car = {
      position: 0,
      driving: false,
    };

    // Fence
    this.fences = {
      gate: {
        normalSituation: 'Herbivores Paddock',
        road: {
          x: [-81, -72, -65, -48, -38, -15, 32, 62, 90, 110],
          y: [174, 174, 175, 175, 188, 214, 255, 268, 275, 277],
        },
      },
      dilo: {
        normalSituation: 'Dilophosaurus Paddock',
        road: {
          x: [129, 140, 153, 172, 201, 226, 250, 270, 283, 295],
          y: [278, 279, 281, 285, 290, 288, 275, 258, 235, 208],
        },
      },
      trex: {
        normalSituation: 'T-Rex Paddock',
        road: {
          x: [298, 295, 283, 271, 250, 218, 245, 258, 260, 258],
          y: [192, 165, 153, 127, 113, 106, 93, 82, 76, 58],
        },
      },
      raptor: {
        normalSituation: 'Velociraptor Paddock',
        road: {
          x: [252, 236, 211, 191, 164, 142, 112, 87, 67, 52],
          y: [35, 17, -3, -12, -2, 7, 38, 57, 65, 75],
        },
      },
      trice: {
        normalSituation: 'Herbivores Paddock',
        road: {
          x: [16, 1, -25, -33, -46, -54, -63, -70, -78, -85],
          y: [104, -118, 149, 161, 169, 175, 175, 175, 174, 174],
        },
      },
    };

    // Sounds
    this.beep = $('#cmd-beep-asset')[0];
    // Statuses
    this.systemStatuses = {
      trex: {
        status: true,
        description: 'TREX enclosure system',
      },
    };
    // Config
    this.env = {
      accessAttempts: 0,
      active: null,
      commands: {
        help: {
          name: 'help',
          summary: 'list available commands',
          manPage:
            'SYNOPSIS\n' +
            '\thelp\n\n' +
            'DESCRIPTION\n' +
            '\tDisplay a command summary for Jurassic Systems.\n\n',
          command: function (env, inputLine) {
            for (var command in env.commands) {
              self.env.active
                .find('.command-history')
                .append(
                  $('<div>').text(
                    self.env.commands[command].name +
                      ' (' +
                      self.env.commands[command].summary +
                      ')'
                  )
                );
            }
          },
        },
        man: {
          name: 'man',
          summary: 'display reference manual for a given command',
          manPage:
            'USAGE\n' +
            '\tman [COMMAND] ...\n\n' +
            'DESCRIPTION\n' +
            '\tman locates and prints the titled entries from the on-line ' +
            'reference manuals.\n',
          command: function (env, inputLine) {
            const arg = inputLine.trim().split(/ +/)[1] || '';
            let output = 'What manual page do you want?';

            if (env.commands.hasOwnProperty(arg)) {
              output = self.env.commands[arg].manPage;
            } else if (arg) {
              output = 'No manual entry for ' + $('<div/>').text(arg).html();
            }

            $('#main-input').append(output);
          },
        },
        ls: {
          name: 'ls',
          summary: 'list files in the current directory',
          manPage:
            'USAGE\n' +
            '\tls [FILE] ...\n\n' +
            'DESCRIPTION\n' +
            '\tList information about the FILEs ' +
            '(the current directory by default).\n\n',
          command: function (env, inputLine) {
            $('#main-input').append(
              $(
                '<div>jurassicpark.jpg</div>' +
                  '<div>test.jpg</div>' +
                  '<div>todolist.txt</div>' +
                  '<div>fences.txt</div>'
              )
            );
          },
        },
        systems: {
          name: 'systems',
          summary: 'list of all systems',
          manPage:
            'USAGE\n' +
            '\tlsystem\n\n' +
            'DESCRIPTION\n' +
            '\tList of systems\n\n',
          command: function (env, inputLine) {
            for (let system in self.systemStatuses) {
              self.env.active
                .find('.command-history')
                .append(
                  $('<div>').text(
                    system + ' - ' + self.systemStatuses[system].description
                  )
                );
            }
          },
        },
        system: {
          name: 'system',
          summary: "check a specific system's status",
          manPage:
            'SYNOPSIS\n' +
            '\tsystem [SYSTEM_NAME]\n\n' +
            'DESCRIPTION\n' +
            "\tCheck the input system and return each sector's " +
            'current status.\n\n',
          command: function (env, inputLine) {
            const arg = inputLine.split(/ +/)[1] || '';
            let output = '<span>system: must specify target system</span>';

            if (arg.length > 0) {
              let system = arg.replace(/s$/, '');
              const systemInfo = self.systemStatuses[system];

              if (systemInfo === undefined) {
                $('#main-input').append($('<div>Unknown system</div>'));
                return;
              }
              system = system.toUpperCase();
              output = '<div>Checking...</div>';
              const displayedStatus = systemInfo.status ? '[OK]' : '[ERROR]';

              $('#main-prompt').addClass('hide');
              $('#main-input').append($(output));
              output =
                '<div>' +
                system +
                ' containment enclosure:</div>' +
                '<table id="system-output"><tbody>' +
                '<tr><td>Security</td><td>' +
                displayedStatus +
                '</td></tr>' +
                '<tr><td>Fence</td><td>' +
                displayedStatus +
                '</td></tr>' +
                '<tr><td>Feeding Pavilion</td><td>[OK]</td></tr>' +
                '</tbody></table>';
              self.beep.play();

              setTimeout(function () {
                const wrap = $('.inner-wrap', self.env.active);
                self.beep.play();
                $('#main-input').append($(output));
                wrap.scrollTop(wrap[0].scrollHeight);
                $('#main-prompt').removeClass('hide');
              }, 900);
            } else {
              $('#main-input').append($(output));
            }
          },
        },
      },
      maxIndex: 1,
      musicOn: false,
      sounds: {},
    };

    this.setActive('#main-terminal');
    this.initMainEvents();
    this.updateCarPosition(0, 'gate');
    this.shiftTrack();
    this.updateSituation(true);
  },
  //  ----- Main methods -----
  registerCurrentTour: function (tour) {
    this.tour = tour;
  },
  updateSituation: function (loading) {
    if (loading) {
      $('#current-situation').text('Loading...');
      return;
    }
    $('#current-situation').text(this.fences[this.tour.scene].normalSituation);
  },
  initMainEvents: function () {
    this.cursorDisplay();
    this.keyboardManagement();
  },
  initTour: function () {
    $('#start-tour').addClass('active');
    this.beep.play();

    $('#tour-initiated')[0].style.display = 'block';
    setTimeout(() => {
      $('#tour-initiated')[0].style.display = 'none';
    }, 5000);
  },
  // ----- Console methods -----
  cursorDisplay: function () {
    const self = this;
    $('body').click(this.removeCursor);

    $('.irix-window').click(function (e) {
      e.stopPropagation();
      self.removeCursor();
      self.setActive(this);
      $('.buffer', this).focus();
      $(this).css('z-index', self.nextIndex());
      $(this).find('.cursor').addClass('active-cursor');
    });
  },
  keyboardManagement: function () {
    const self = this;
    $(window).keydown(function (e) {
      if ([37, 38, 39, 40].indexOf(e.keyCode || e.which) > -1) {
        e.preventDefault();
      }
    });
    $('#main-terminal .buffer').bind('input propertychange', function () {
      $('#curr-main-input').text($(this).val());
    });

    $('.irix-window').keydown(function (e) {
      const key = e.keyCode || e.which;
      const activeTerminal = self.getActive();

      if (!activeTerminal) {
        return false;
      }

      // If press enter
      if (key === 13) {
        const line = activeTerminal.find('.buffer').val();
        activeTerminal.find('.buffer').val('');

        $('#curr-main-input').html('');
        self.buildCommandLine(line);
      }

      const wrap = activeTerminal.find('.inner-wrap');
      wrap.scrollTop(wrap[0].scrollHeight);
    });
  },
  buildCommandLine: function (line) {
    const commandName = line.trim().split(/ /)[0];
    const command =
      this.env.commands[commandName] && this.env.commands[commandName].command;

    this.env.active
      .find('.command-history')
      .append($('<div class="entered-command">').text('> ' + line));

    if (command) {
      command(this.env, line);
    } else if (commandName) {
      this.env.active
        .find('.command-history')
        .append($('<div>').text(commandName + ': command not found'));
    }
  },
  addCommand: function (details) {
    if (
      details.name &&
      !this.env.commands.hasOwnProperty(details.name) &&
      details.command.constructor === Function
    ) {
      this.env.commands[details.name] = details;
    }
  },
  setActive: function (active) {
    this.env.active = $(active) || this.env.active;
  },
  getActive: function () {
    return this.env.active;
  },
  nextIndex: function () {
    return ++this.env.maxIndex;
  },
  removeCursor: function () {
    $('.cursor', '.irix-window').removeClass('active-cursor');
    $('.buffer').blur();
  },
  // ----- car management -----
  stopCar: function () {
    this.car.driving = false;
    $('#car-speed').text('0');
  },
  startCar: function () {
    this.car.driving = true;
    $('#car-speed').text('12');
  },
  updateCarPosition: function (position, scene) {
    const currentScene = scene ? scene : this.tour.scene;
    this.car.position = position;
    $('#marker').css('left', this.fences[currentScene].road.x[position] + 'px');
    $('#marker').css('top', this.fences[currentScene].road.y[position] + 'px');
  },
  shiftTrack: function () {
    if (!this.car.driving) {
      setTimeout(() => {
        this.shiftTrack();
      }, 50);
      return;
    }
    $('.vehicle-track > div').css('left', this.trackpos + 'px');
    this.trackpos = this.trackpos + 1;
    if (this.trackpos > -25) {
      this.trackpos = -216;
    }
    setTimeout(() => {
      this.shiftTrack();
    }, 50);
  },
});
