'use strict';

// FetchedJsonData is generated at build time and embedded here
var FetchedJsonData = {
  "AnswersSpreadsheet": [
    {
      "id": "Community",
      "text": "<strong>Community Builder / Sustainability Coordinator</strong> – e.g. community energy organizer, green job coach, retrofit outreach officer."
    },
    {
      "id": "Communicator",
      "text": "<strong>Communicator / Creative Advocate</strong> – e.g. sustainability content creator, environmental educator, climate communications officer."
    },
    {
      "id": "Analyst",
      "text": "<strong>Researcher / Sustainability Analyst</strong> – e.g. carbon analyst, ESG data specialist, environmental policy researcher."
    },
    {
      "id": "Builder",
      "text": "<strong>Hands-on Technical Role / Green Construction Worker</strong> – e.g. solar installer, heat pump engineer, EV technician."
    },
    {
      "id": "Grower",
      "text": "<strong>Nature-Based Role / Conservation or Agroecology</strong> – e.g. park ranger, urban greening officer, organic grower."
    }
  ],
  "QuestionsSpreadsheet": [
    { "id": "Q1", "text": "What type of work environment appeals to you the most?", "questionTypeId": "ENVIRONMENT" },
    { "id": "Q2", "text": "Which activity sounds most fulfilling to you?", "questionTypeId": "MOTIVATION" },
    { "id": "Q3", "text": "When you work on a group project, what role do you usually take?", "questionTypeId": "WORK_STYLE" },
    { "id": "Q4", "text": "What do people often compliment you on?", "questionTypeId": "STRENGTHS" },
    { "id": "Q5", "text": "If you could volunteer for a day, which project would you choose?", "questionTypeId": "MOTIVATION" },
    { "id": "Q6", "text": "Which statement sounds most like you?", "questionTypeId": "STRENGTHS" },
    { "id": "Q7", "text": "What is your dream scenario for making an impact?", "questionTypeId": "IMPACT_STYLE" },
    { "id": "Q8", "text": "Which school subject or activity do/did you enjoy the most?", "questionTypeId": "INTEREST" }
  ],
  "ChoicesSpreadsheet": [
    // ... choices omitted for brevity, same as before ...
  ],
  "QuestionTypesSpreadsheet": [
    { "id": "ENVIRONMENT", "text": "Preferred work setting/environment" },
    { "id": "MOTIVATION",  "text": "Motivating activities and purpose" },
    { "id": "WORK_STYLE",  "text": "Team roles and working style" },
    { "id": "STRENGTHS",   "text": "Personal traits and soft skills" },
    { "id": "IMPACT_STYLE","text": "Desired impact on the world" },
    { "id": "INTEREST",    "text": "Subject interests and academic strengths" }
  ]
};

// Model classes
function QuestionType(options) { Object.assign(this, options); }
function Question(options)     { Object.assign(this, options); }
function Answer(options)       { Object.assign(this, options); }
function Choice(options)       { Object.assign(this, options); }

// Engine Namespace
var EngineNameSpace = {
  listOfQuestionTypes: [],
  listOfQuestions:     [],
  listOfChoices:       [],
  listOfAnswers:       [],
  listOfChosenChoices: [],
  currentQuestion:     0
};

// Utility functions used by the quiz runner
var QuizRunner = {
  getRadioOptionContainer: function(name, value, text) {
    return "<label class='choice'><div class='choice-radio-button'><input type='radio' value='" + value + "' name='" + name + "'></div><div class='choice-text'>" + text + "</div></label>";
  },

  getChoicesForQuestion: function(questionId) {
    return _.filter(EngineNameSpace.listOfChoices, function(choice) {
      return choice.questionId === questionId;
    });
  },

  getElementFromListById: function(list, elementId) {
    return _.find(list, function(o) { return o.id === elementId; });
  },

  fillQuestionContainer: function(questionId) {
    var question = QuizRunner.getElementFromListById(EngineNameSpace.listOfQuestions, questionId);
    $('#question-text').text(question.text);
    $('#quiz-status').text('QUESTION ' + questionId + '/' + EngineNameSpace.listOfQuestions.length);
    var choices = QuizRunner.shuffle(QuizRunner.getChoicesForQuestion(questionId));
    $('#choices').empty();
    _.each(choices, function(choice) {
      $("#choices").append(
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
      QuizRunner.fillQuestionContainer(EngineNameSpace.currentQuestion.toString());
    } else {
      $('.screen').hide();
      QuizRunner.displayResults();
      $('#results-container').show();
    }
  },

  groupChoicesByQuestionTypes: function() {
    return _.groupBy(EngineNameSpace.listOfChosenChoices, function(choice) {
      return choice.questionTypeId;
    });
  },

  groupChoicesByAnswers: function(choices) {
    return _.groupBy(choices, function(choice) {
      return choice.answerId;
    });
  },

  findMostSuitableAnswer: function(groupByAnswers) {
    var answerCounts = _.map(groupByAnswers, function(vals, key) {
      return { answerId: key, numberOfElements: vals.length };
    });
    return _.max(answerCounts, function(a){ return a.numberOfElements; }).answerId;
  },

  displayResults: function() {
    var groupedByType = QuizRunner.groupChoicesByQuestionTypes();
    _.each(groupedByType, function(value, key) {
      var groupByAnswers = QuizRunner.groupChoicesByAnswers(value);
      var chosenAnswerId = QuizRunner.findMostSuitableAnswer(groupByAnswers);
      var chosenAnswer = QuizRunner.getElementFromListById(EngineNameSpace.listOfAnswers, chosenAnswerId);
      var answerElement = "<span class='answer-text'>" + chosenAnswer.text + "</span>";
      $('#results-section').append($('<li>').addClass('result').append(answerElement));
    });
  },

  shuffle: function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
};

// On DOM ready: map CSV-based FetchedJsonData into model objects and start quiz
$(document).ready(function(){
  EngineNameSpace.listOfQuestionTypes = FetchedJsonData.QuestionTypesSpreadsheet.map(function(item){
    return new QuestionType({ id: item.id, text: item.text });
  });

  EngineNameSpace.listOfAnswers = FetchedJsonData.AnswersSpreadsheet.map(function(item){
    return new Answer({ id: item.id, text: item.text });
  });

  EngineNameSpace.listOfQuestions = FetchedJsonData.QuestionsSpreadsheet.map(function(item){
    return new Question({ id: item.id, text: item.text, questionTypeId: item.questionTypeId });
  });

  EngineNameSpace.listOfChoices = FetchedJsonData.ChoicesSpreadsheet.map(function(item){
    return new Choice({ id: item.id, questionId: item.questionId, text: item.text, answerId: item.answerId, questionTypeId: item.questionTypeId });
  });

  EngineNameSpace.currentQuestion = 0;
  QuizRunner.showNextQuestion();

  $('#submit-choice').click(function(event){
    event.preventDefault();
    var checked = $('#questionnaire input[type=radio]:checked');
    if (!checked.length) {
      $('#error-field').show();
    } else {
      $('#error-field').hide();
      QuizRunner.pushChosenChoice(checked.val());
      QuizRunner.showNextQuestion();
    }
  });
});
