/*!
 * fastshell
 * Fiercely quick and opinionated front-ends
 * https://HosseinKarami.github.io/fastshell
 * @author Hossein Karami
 * @version 1.0.5
 * Copyright 2016. MIT licensed.
 */
(function ($, window, document, moment) {
  'use strict';

  $(function () {

    var hourOffset = 0;
    var lastMinutes = 0;
    var lastHour  = 0;
    var words = ['it', 'is'];
    var elements = document.querySelector('#svg').childNodes;

    function setDigits(_hour, _words, _mins) {

      for (var h = 0; h < elements.length; h++) { //clear all elements
        var elementToClear = elements[h];
        if (elementToClear.nodeType !== 1) continue; // skip anything that isn't an element
        elementToClear.setAttribute('class', 'inactive');
      }

      for (var i = 0; i < elements.length; i++){ //loop through all elements
        var element = elements[i];
        if (element.nodeType !== 1) continue; // skip anything that isn't an element

        if (parseInt(element.getAttribute('time:hour')) === _hour) {
          element.setAttribute('class', 'active');
          element.parentNode.appendChild(element); //move to top
        }

        if (element.getAttribute('time:word') !== null) {
          for (var j = 0; j < _words.length; j++) {
            if(element.getAttribute('time:word') === _words[j]) {
              element.setAttribute('class', 'active');
              //element.parentNode.appendChild(element);
            }
          }
        }

        if (_mins < 21) { //single word minutes required
          if (parseInt(element.getAttribute('time:minute')) === _mins) {
            element.setAttribute('class', 'active');
            element.parentNode.appendChild(element);
          }
        } else { //multiword minutes required
          if (_mins !== 30) { //dont show minute, handled by 'half' & 'past' words
            var difference = _mins - 20;
            if (parseInt(element.getAttribute('time:minute')) === 20) {
              element.setAttribute('class', 'active');
            }
            if (difference < 10) {
              if (parseInt(element.getAttribute('time:minute')) === difference) {
                element.setAttribute('class', 'active');
                element.parentNode.appendChild(element); //move to front
              }
            }
          }
        }
      }
    }

    function displayTime(now){
      var hour = now.get('hour');
      var minutes = now.get('minute');
      //console.log(hour + ':' + minutes);

      if (hour >= 12) {
        hour = hour - 12;
      }

      if (minutes > 30) { //minutes until next hour
        hourOffset = 1;

        if (minutes === 45) {
          words = ['it', 'is', 'quarter', 'to'];
        } else {
          words = ['it', 'is', 'to'];
        }
      } else { //minutes past hour
        hourOffset = 0;

        if (minutes === 0) {
          words = ['it', 'is', 'oclock'];
        } else if (minutes === 15) {
          words = ['it', 'is', 'quarter', 'past'];
        } else if (minutes === 30) {
          words = ['it', 'is', 'half', 'past'];
        } else {
          words = ['it', 'is', 'past'];
        }
      }

      if (lastHour !== hour || lastMinutes !== minutes) { //time has changed
        var adjustedHour = hour + hourOffset; //add hour to hour offset
        if (adjustedHour === 0) {
          adjustedHour = 12; //TODO - set midnight
        }
        var adjustedMinutes;
        if (minutes > 30) {
          adjustedMinutes = 60 - minutes;
        } else {
          adjustedMinutes = minutes;
        }
        setDigits(adjustedHour, words, adjustedMinutes);

        lastHour = hour; //record last hour and minute
        lastMinutes = minutes;
      }
    }

    function loop() {
      var now = moment();
      displayTime(now);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

  });

})(jQuery, window, document, moment);
