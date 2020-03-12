  // Globals
  var questions = [
    {
      text: "1. How do you describe yourself as a developer?",
      type: "radio",
      options: [
        "Hermit",
        "Sociable",
        "Serious",
        "Grumpy",
        "Do not know yet"
      ]
    },
    {
      text: "2. Select the JavaScript based technologies",
      type: "checkbox",
      options: ["AngularJS", "Ember", "VueJS", "Java", "C#"]
    },
    {
      text: "3. Enter a palindrome into the below text field",
      type: "text",
      options: null
    },
    {
      text:
        "4. Type a sentence into the first text box, then type that same sentence in the second box, in reverse",
      type: "text",
      options: null
    }
  ];
  var questionTimer;
  var answers = { q1: 0, q2: "", q3: 0, q4: 0 };

  var currentQuestion = 0;

  /**
    Loads the next question to the page, starting with question 1 on page load
  */
  function nextQuestion() {
    timer();

    if (currentQuestion > 0 && currentQuestion < 5) {
      saveAnswer();
      // Incrementing the progress bar based on the current question
      document.getElementById("progressBar").value = currentQuestion;
    }
    if (currentQuestion < 4) {
      var nextQuestionObject = questions[currentQuestion];

      x = document.getElementById("question");
      x.innerHTML = nextQuestionObject.text;
      x = document.getElementById("options");
      var html = "";
      var type = nextQuestionObject.type;

      // Multiple option questions
      if (nextQuestionObject.options != null) {
        for (var i = 0; i < nextQuestionObject.options.length; i++) {
          var option = nextQuestionObject.options[i];
          html +=
            "<input type='" +
            type +
            "' id='" +
            option +
            "' name='group' value='" +
            option +
            "'>";
          html += "<label for='" + option + "'>" + option + "</label><br>";
        }
      } else {
        // Custom question types -- Palindromes
        if (currentQuestion == 2) {
          html += "<label for='q3'>Enter palindrome</label><br>";
          html += "<input type='" + type + "' id='q3'>";
        } else {
          html += "<label for='q4'>Enter Sentence</label><br>";
          html += "<input type='" + type + "' id='q4'><br>";
          html += "<label for='q4'>Enter Reversed Sentence</label><br>";
          html += "<input type='" + type + "' id='q42'>";
        }
      }

      x.innerHTML = html;
    }

    if (currentQuestion == 4) {
      showResults();
    }

    currentQuestion++;
  }

  /**
    Runs a 10 second timer on questions 1 and 2 only, resets when question changes.
    The timer ending has no effect.
  */
  function timer() {
    if (questionTimer != null) {
      clearInterval(questionTimer);
      document.getElementById("countdown").innerHTML = "";
    }
    if (currentQuestion == 0 || currentQuestion == 1) {
      var timeleft = 10;
      questionTimer = setInterval(function() {
        if (timeleft <= 0) {
          clearInterval(questionTimer);
          document.getElementById("countdown").innerHTML = "Finished";
        } else {
          document.getElementById("countdown").innerHTML =
            timeleft + " seconds remaining";
        }

        timeleft -= 1;
      }, 1000);
    } else {
      document.getElementById("countdown").innerHTML = "";
    }
  }

  /**
    Loads the results for the quiz to the final page, as well as a list of restaurants using Zomato widget.
    The users answers are listed in black. Correct answers are highlighted in Green. Incorrect answers are
    highlighted in Red.
  */
  function showResults() {
    document.getElementById("submit").hidden = true;
    document.getElementById("progressBar").hidden = true;
    x = document.getElementById("question");
    x.innerHTML = "Results";

    // Q1
    console.log("show 1");
    x = document.getElementById("options");
    var resultHtml = "Question 1: " + questions[0].options;
    x.innerHTML = resultHtml;
    highlight(answers.q1);

    // Q2
    console.log("show 2");
    resultHtml = "<br><br>Question 2: " + questions[1].options;
    var answers2 = answers.q2.split(",");
    x.innerHTML += resultHtml;

    if (answers2.indexOf("AngularJS") >= 0) {
      highlight("AngularJS");
    }
    if (answers2.indexOf("Ember") >= 0) {
      highlight("Ember");
    }
    if (answers2.indexOf("VueJS") >= 0) {
      highlight("VueJS");
    }

    // Q3
    console.log("show 3");
    if (answers.q3 == "") {
      console.log("3 empty");
      resultHtml = "<br><br>Question 3: NO ANSWER GIVEN";
    } else {
      console.log("3 has answer");
      resultHtml = "<br><br>Question 3: " + answers.q3;
    }
    x.innerHTML += resultHtml;
    var palindrome = answers.q3;
    if (palindrome.length > 0) {
      if (checkPalindrome(palindrome)) {
        highlight(palindrome);
      }
    }
    errorHighlight(palindrome);

    // Q4
    console.log("show 4");
    if (answers.q4 == ",") {
      console.log("4 is empty");
      resultHtml = "<br><br>Question 4: NO ANSWER GIVEN";
    } else {
      console.log("4 has answer");
      resultHtml = "<br><br>Question 4: " + answers.q4;
    }
    x.innerHTML += resultHtml;
    var splitMe = answers.q4.split(",");
    var palindrome = splitMe[0] + splitMe[1];
    if (palindrome.length > 0) {
      if (checkPalindrome(palindrome)) {
        highlight(splitMe[0]);
        highlight(splitMe[1]);
      }
    }
    errorHighlight(splitMe[0]);
    errorHighlight(splitMe[1]);

    console.log("show list");
    // Restaurant list
    resultHtml =
      "<br><br>Select your favorite San Diego restaurant<br><br><div class='widget_wrap' style='max-width:400px;width:100%;height:550px;display:inline-block;'><iframe src='https://www.zomato.com/widgets/all_collections.php?city_id=302&language_id=1&theme=red&widgetType=custom' style='position:relative;width:100%;height:100%;' border='0' frameborder='0'></iframe></div>";
    x.innerHTML += resultHtml;
  }

  /**
    Checks whether the string parameter is a palindrome
  */
  function checkPalindrome(str) {
    var len = str.length;
    var mid = Math.floor(len / 2);

    for (var i = 0; i < mid; i++) {
      if (str[i] !== str[len - 1 - i]) {
        return false;
      }
    }

    return true;
  }

  /**
    Finds the text parameter on the current view and highlights it red
  */
  function errorHighlight(text) {
    var inputText = document.getElementById("options");
    var innerHTML = inputText.innerHTML;
    var index = innerHTML.indexOf(text);
    if (index >= 0) {
      innerHTML =
        innerHTML.substring(0, index) +
        "<span class='error'>" +
        innerHTML.substring(index, index + text.length) +
        "</span>" +
        innerHTML.substring(index + text.length);
      inputText.innerHTML = innerHTML;
    }
  }

  /**
    Finds the text parameter on the current view and highlights it green
  */
  function highlight(text) {
    var inputText = document.getElementById("options");
    var innerHTML = inputText.innerHTML;
    var index = innerHTML.indexOf(text);
    if (index >= 0) {
      innerHTML =
        innerHTML.substring(0, index) +
        "<span class='highlight'>" +
        innerHTML.substring(index, index + text.length) +
        "</span>" +
        innerHTML.substring(index + text.length);
      inputText.innerHTML = innerHTML;
    }
  }

  /**
    Saves the answer to the question that was just submitted so it can be evaluated at the end
  */
  function saveAnswer() {
    switch (currentQuestion) {
      case 1:
        var group = document.getElementsByName("group");
        for (var i = 0; i < group.length; i++) {
          if (group[i].checked) {
            answers.q1 = group[i].value;
          }
        }
        console.log("answer 1 " + answers.q1);
        break;
      case 2:
        var group = document.getElementsByName("group");
        for (var i = 0; i < group.length; i++) {
          if (group[i].checked) {
            if (answers.q2 == "") {
              answers.q2 = group[i].value;
            } else {
              answers.q2 += "," + group[i].value;
            }
          }
        }
        console.log("answer 2 " + answers.q2);
        break;
      case 3:
        var palindrome = document.getElementById("q3").value;
        answers.q3 = palindrome;
        console.log("answer 3 " + answers.q3);
        break;
      case 4:
        var palindrome1 = document.getElementById("q4").value;
        var palindrome2 = document.getElementById("q42").value;
        answers.q4 = palindrome1 + "," + palindrome2;
        console.log("answer 4 " + answers.q4);
        break;
    }
  }
