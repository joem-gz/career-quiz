// quizRunner.js

// Engine Namespace
var EngineNameSpace = {
  listOfQuestionTypes: [],
  listOfQuestions:     [],
  listOfChoices:       [],
  listOfAnswers:       [],
  listOfChosenChoices: [],
  currentQuestion:     0
};

var QuizRunner = {
  getRadioOptionContainer: function(name, value, text) {
    return "<label class='choice'>" +
             "<div class='choice-radio-button'>" +
               "<input type='radio' value='" + value + "' name='" + name + "'>" +
             "</div>" +
             "<div class='choice-text'>" + text + "</div>" +
           "</label>";
  },

  getChoicesForQuestion: function(questionId) {
    return _.filter(EngineNameSpace.listOfChoices, function(choice) {
      return choice.questionId === questionId;
    });
  },

  getElementFromListById: function(list, elementId) {
    return _.find(list, function(o) { return o.id === elementId; });
  },

  fillQuestionContainer: function(questionIndex) {
    var q = EngineNameSpace.listOfQuestions[questionIndex - 1];
    $('#question-text').text(q.text);
    $('#quiz-status').text('QUESTION ' + questionIndex + '/' + EngineNameSpace.listOfQuestions.length);

    var choices = QuizRunner.shuffle(QuizRunner.getChoicesForQuestion(q.id));
    $('#choices').empty();
    _.each(choices, function(choice) {
      $('#choices').append(
        QuizRunner.getRadioOptionContainer(choice.questionId, choice.id, choice.text)
      );
    });
  },

  pushChosenChoice: function(choiceId) {
    var choice = QuizRunner.getElementFromListById(EngineNameSpace.listOfChoices, choiceId);
    EngineNameSpace.listOfChosenChoices.push(choice);
  },

  showNextQuestion: function() {
    if (EngineNameSpace.currentQuestion < EngineNameSpace.listOfQuestions.length) {
      $('.screen').hide();
      $('#quiz-container').show();
      EngineNameSpace.currentQuestion += 1;
      QuizRunner.fillQuestionContainer(EngineNameSpace.currentQuestion);
    } else {
      $('.screen').hide();
      QuizRunner.displayResults();
      $('#results-container').show();
    }
  },

  groupChoicesByQuestionTypes: function() {
    return _.groupBy(EngineNameSpace.listOfChosenChoices, function(c) {
      return c.questionTypeId;
    });
  },

  groupChoicesByAnswers: function(choices) {
    return _.groupBy(choices, function(c) {
      return c.answerId;
    });
  },

  findMostSuitableAnswer: function(groupByAnswers) {
    var counts = _.map(groupByAnswers, function(vals, key) {
      return { answerId: key, numberOfElements: vals.length };
    });
    return _.max(counts, function(a) { return a.numberOfElements; }).answerId;
  },

  displayResults: function() {
    var byType = QuizRunner.groupChoicesByQuestionTypes();
    _.each(byType, function(choices, typeId) {
      var byAnswer = QuizRunner.groupChoicesByAnswers(choices);
      var bestAnswerId = QuizRunner.findMostSuitableAnswer(byAnswer);
      var answer = QuizRunner.getElementFromListById(EngineNameSpace.listOfAnswers, bestAnswerId);
      $('#results-section').append(
        $("<li>").addClass('result').html("<span class='answer-text'>" + answer.text + "</span>")
      );
    });
  },

  shuffle: function(array) {
    var i = array.length, t, j;
    while (i) {
      j = Math.floor(Math.random() * i--);
      t = array[i];
      array[i] = array[j];
      array[j] = t;
    }
    return array;
  }
};
