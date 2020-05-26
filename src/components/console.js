var $ = require('jquery');
AFRAME.registerSystem('console', {
  init: function () {
    this.env = {
      accessAttempts: 0,
      active: null,
      commands: {
        ls: {
          name: 'ls',
          summary: 'list files in the current directory',
          manPage:
            'SYNOPSIS\n' +
            '\tls [FILE] ...\n\n' +
            'DESCRIPTION\n' +
            '\tList information about the FILEs ' +
            '(the current directory by default).\n\n' +
            'AUTHOR\n' +
            '\tWritten by Richard Stallman and David MacKenzie.\n',
          command: function (env, inputLine) {
            $('#main-input').append($('<div>zebraGirl.jpg</div>'));
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
