var $ = require('jquery');
AFRAME.registerSystem('console', {
  init: function () {
    const self = this;

    this.beep = $('#cmd-beep-asset')[0];

    this.systemStatuses = {
      trex: {
        status: true,
        description: 'TREX enclosure system',
      },
    };

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
            '\tDisplay a command summary for Jurassic Systems.\n\n' +
            'AUTHOR\n' +
            '\tWritten by <a href="https://tully.io">Tully Robinson</a>.\n',
          command: function (env, inputLine) {
            for (var command in env.commands) {
              self.env.active
                .find('.command-history')
                .append(
                  $('<div>').text(
                    self.env.commands[command].name +
                      ' - ' +
                      self.env.commands[command].summary
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
            $('#main-input').append($('<div>zebraGirl.jpg</div>'));
          },
        },
        systems: {
          name: 'systems',
          summary: 'list of systems ([name] - [desc])',
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
          summary: "check a system's current status",
          manPage:
            'SYNOPSIS\n' +
            '\tsystem [SYSTEM_NAME]\n\n' +
            'DESCRIPTION\n' +
            "\tCheck the input system and return each sector's " +
            'current status.\n\n' +
            'AUTHOR\n' +
            '\tWritten by Dennis Nedry.\n',
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
    this.initEvents();
  },
  initEvents: function () {
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

    $(window).keydown(function (e) {
      if ([37, 38, 39, 40].indexOf(e.keyCode || e.which) > -1) {
        e.preventDefault();
      }
    });

    $('.irix-window').keydown(function (e) {
      const key = e.keyCode || e.which;
      const activeTerminal = self.getActive();

      if (!activeTerminal) {
        return false;
      }

      // if enter
      if (key === 13) {
        const line = activeTerminal.find('.buffer').val();
        activeTerminal.find('.buffer').val('');

        $('#curr-main-input').html('');
        self.buildCommandLine(line);
      }

      const wrap = activeTerminal.find('.inner-wrap');
      wrap.scrollTop(wrap[0].scrollHeight);
    });

    $('#main-terminal .buffer').bind('input propertychange', function () {
      $('#curr-main-input').text($(this).val());
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
});
