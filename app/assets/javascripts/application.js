// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require_self
//= require_tree .
//= require twitter/bootstrap

var appcontroller = {
  init: function (selectors) {
    startClicked.init(selectors);
    timerSetting.init(selectors);
    NewsFeed.init(selectors);
    buttonClicked.init(selectors);
  },
  hideYesandNo: function (selectors) {
    selectors.yes.fadeToggle( "slow", "linear" );
    selectors.no.fadeToggle( "slow", "linear" );
    selectors.start.prop("disabled",false);
  },
  showStartHideYesNo: function(selectors) {
    selectors.no.css("display", "none")
    selectors.yes.css("display", "none")
    selectors.starts.fadeToggle( "slow", "linear")
    selectors.starts.css("display", "inline")
    selectors.starts.prop("disabled", false)
  }
}

var startClicked = (function (selectors) {
  counter = 0;
  counter1 = 0;
  var triggerCountdown = function (event, selectors){
    selectors.starts.prop("disabled",true)
    var string = $('#countdown').text().replace(':00','')
    var string = Number(string)
    countdown("countdown", 0, 01);
  };
  var countdown = function (element, minutes, seconds) {
    var time = minutes*60 + seconds;
    var countdown = $('#countdown');
    var interval = setInterval(function() {
    var el = document.getElementById(element);
      if(time == -1) {
        var audio = new Audio('/assets/ambiance.wav');
        audio.play();
        countdown.text('Done?')
        $('#start').fadeToggle( "slow", "linear" )
        $('#start').css("display", "none")
        appcontroller.hideYesandNo()

        clearInterval(interval);
        return;
      }
      var minutes = Math.floor( time / 60 );
      if (minutes < 10) minutes = "0" + minutes;
      var seconds = time % 60;
      if (seconds < 10) seconds = "0" + seconds;
      var text = minutes + ':' + seconds;
      el.innerHTML = text;
      time--;
    }, 1000);
  };

  var bindFunctions = function (selectors) {
    selectors.starts.on("click", function (event){
      triggerCountdown(event, selectors);
    });
  };

  var init = function (selectors) {
    bindFunctions(selectors);
  };

  return {
    init: init,
    startClicked: startClicked
  };
}) ();

var buttonClicked = (function (selectors) {
  var id = 0;
  var noButton = function(event, selectors) {
    selectors.countdown.text("25:00")
    appcontroller.hideYesandNo();
    appcontroller.showStartHideYesNo(selectors);
  };
  var yesButton = function(event, selectors) {

    // check if the user needs to login
    var loginCheck = function (selectors) {
      if (selectors.counterText.text() == '1') {
        selectors.primaryContent.css('display', 'none');
        selectors.signupContent.fadeToggle( "slow", "linear")
        selectors.loginPartial.click(function() {
          selectors.signupContent.css('display', 'none');
          selectors.loginContent.fadeToggle( "slow", "linear")
        })

        selectors.submitButton.on("click", function() {
          selectors.signupContent.css('display', 'none')
          selectors.signupContent.css('display', 'none')
          selectors.loginPartial.css('display', 'none')
          selectors.primaryContent.fadeToggle( "slow", "linear" );
        })
      }
    }
    loginCheck()


    //Check if the user needs to login
    var addNewsFeeditem = function () {
      var textbox = $('#textbox')
      var facebook = $('#facebook')
      if (textbox.text().length >= 3 && facebook.text().length > 1 ) {
        var inputstring =  $('#facebook').text() + " ~ " + textbox.text()
        var index = Newsfeed.counterDisplay + 1
        NewsFeed.texts.splice(index,0, inputstring)
      }
    }
    addNewsFeeditem()


    //Show start button
    var showStartButton = function (){
      selectors.countdown.text("25:00")
      appcontroller.hideYesandNo();
      appcontroller.showStartHideYesNo(selectors)
      counter1++
    }
    showStartButton()


    //determine increase of pomodoro count
    var increaseProgressBar = function () {
      id +=10
      $('.progressBar').attr("id", "max" + id)
      function progress(percent, element) {
        var progressBarWidth = percent * element.width() / 100;
        buttonClicked.progressBarCheck(progressBarWidth, element)
      };

      $('.progressBar').each(function() {
        var bar = $(this);
        var max = $(this).attr('id');
        max = max.substring(3);
        progress(max, bar);
      });
    }
    increaseProgressBar()

    //pomodoros display
    var correctPomodoros = function () {
      $('#pomodoroCountertext').text(counter1)
    }
    correctPomodoros()
  }

  var progressBarCheck = function (progressBarWidth, element) {
    if (progressBarWidth <= 500) {
      element.find('div').animate({ width: progressBarWidth }, 500);
    }
  }

  var bindFunctions = function (selectors) {
    selectors.no.on("click",  function (event) {
      noButton(event, selectors);
    })
    selectors.yes.on("click",  function (event) {
      yesButton(event, selectors);
    })
  };

  var init = function (selectors) {
    bindFunctions(selectors);
  };

  return {
    noButton: noButton,
    init: init,
    progressBarCheck: progressBarCheck
  }
}) ();

var NewsFeed = {
  init: function () {
    NewsFeed.displays()
  },
  texts: [["Jenna ~ Read two chapters"], ["Mary ~ Write a Cover Letter"], ["Dave ~ Practice Designing"], ["Alex ~ Outline Blog Post"],["Jamie ~ finish reading the news"]],
  textdisplay: document.getElementById('newsfeed'),
  counterDisplay: 0,
  displays: function () {
    var feed = document.getElementById('newsfeed')
      setInterval(function(){
        $('#newsfeed').css("display", "none")
        feed.innerHTML = NewsFeed.texts[NewsFeed.counterDisplay][0]
        $('#newsfeed').show( 1500, function() {});
        NewsFeed.counterDisplay++
        if (NewsFeed.counterDisplay == NewsFeed.texts.length) {
            NewsFeed.counterDisplay = 0;
          }
        },11000)
  }
}

var timerSetting = (function (selectors) {
  var setTimer = function (event, selectors, length) {
    var countdown = $('#countdown');
    switch (length)
    {
      case 3:
        countdown.text("25:00");
        break;
      case 2:
        countdown.text("10:00");
      break;
      case 1:
        countdown.text("5:00");
      break;
    }

  }

  var bindFunctions = function (selectors) {
    selectors.longPomodoro.on("click",  function (event) {
      setTimer(event, selectors, 3)
    });

    selectors.medPomodoro.on("click", function (event) {
      setTimer(event, selectors, 2)
    });

    selectors.shortPomodoro.on("click", function (event) {
      setTimer(event, selectors, 1)
    });
  };

  var init = function (selectors) {
    bindFunctions(selectors);
  };

  return {
    init: init
  }

  }) ();

$(function (){
  var selectors = {
    no: $('#no'),
    yes: $('#yes'),
    starts: $('#start'),
    countdown: $('#countdown'),
    longPomodoro: $('.twenty-five'),
    shortPomodoro: $('.five'),
    medPomodoro: $('.ten'),
    counterText: $('#pomodoroCountertext'),
    primaryContent: $('.primary-content'),
    signupContent: $('.signup-content'),
    loginPartial: $('#login-partial'),
    loginContent:  $('#login-content')
    submitButton:  $('#submit-button')
  };
  appcontroller.init(selectors)
$('#login-partial').click(function() {
  $('#login-form').css("display", "inline-block")
  })
});