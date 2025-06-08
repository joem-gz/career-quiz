// src/quizRunner.js

// Engine namespace holds all of our lists + state
var EngineNameSpace = {
  listOfQuestionTypes: [],
  listOfQuestions:     [],
  listOfChoices:       [],
  listOfAnswers:       [],
  listOfChosenChoices: [],
  currentQuestion:     0
};

var QuizRunner = {
  // Build a single radio option
  getRadioOptionContainer(name, value, text) {
    return  "<label class='choice'>" +
              "<div class='choice-radio-button'>" +
                "<input type='radio' name='"+ name +"' value='"+ value +"'>" +
              "</div>" +
              "<div class='choice-text'>"+ text +"</div>" +
            "</label>";
  },

  // Grab only the choices for a given question
  getChoicesForQuestion(questionId) {
    return _.filter(EngineNameSpace.listOfChoices, c => c.questionId === questionId);
  },

  // Find any object in one of our lists by its `id`
  getElementFromListById(list, elementId) {
    return _.find(list, item => item.id === elementId);
  },

  // Render question #n
  fillQuestionContainer(questionIndex) {
    // questions are zero-based internally
    var q = EngineNameSpace.listOfQuestions[questionIndex - 1];
    $('#question-text').text(q.text);
    $('#quiz-status').text(`QUESTION ${questionIndex}/${EngineNameSpace.listOfQuestions.length}`);

    // shuffle and render its choices
    var choices = QuizRunner.shuffle( this.getChoicesForQuestion(q.id) );
    $('#choices').empty();
    _.each(choices, choice => {
      $('#choices').append(
        QuizRunner.getRadioOptionContainer(choice.questionId, choice.id, choice.text)
      );
    });
  },

  // Record the user’s pick
  pushChosenChoice(choiceId) {
    const choice = QuizRunner.getElementFromListById(EngineNameSpace.listOfChoices, choiceId);
    EngineNameSpace.listOfChosenChoices.push(choice);
  },

  // Advance or finish
  showNextQuestion() {
    if (EngineNameSpace.currentQuestion < EngineNameSpace.listOfQuestions.length) {
      $('.screen').hide();
      $('#quiz-container').show();
      EngineNameSpace.currentQuestion++;
      QuizRunner.fillQuestionContainer(EngineNameSpace.currentQuestion);
    } else {
      $('.screen').hide();
      QuizRunner.displayResults();
      $('#results-container').show();
    }
  },

  // Group choices first by questionType, then by answer
  groupChoicesByQuestionTypes() {
    return _.groupBy(EngineNameSpace.listOfChosenChoices, c => c.questionTypeId);
  },
  groupChoicesByAnswers(choices) {
    return _.groupBy(choices, c => c.answerId);
  },

  // Pick the answer with the highest count
  findMostSuitableAnswer(grouped) {
    const counts = _.map(grouped, (vals, key) => ({
      answerId: key,
      numberOfElements: vals.length
    }));
    return _.max(counts, a => a.numberOfElements).answerId;
  },

  // Show the final results
  displayResults() {
    const byType = QuizRunner.groupChoicesByQuestionTypes();
    _.each(byType, choicesForType => {
      const byAnswer = QuizRunner.groupChoicesByAnswers(choicesForType);
      const bestAnswerId = QuizRunner.findMostSuitableAnswer(byAnswer);
      const answer = QuizRunner.getElementFromListById(EngineNameSpace.listOfAnswers, bestAnswerId);
      $('#results-section').append(
        `<li class="result"><span class="answer-text">${answer.text}</span></li>`
      );
    });
  },

  // Simple Fisher–Yates shuffle
  shuffle(arr) {
    var a = arr.slice(), m = a.length, t, i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = a[m]; a[m] = a[i]; a[i] = t;
    }
    return a;
  }
};
