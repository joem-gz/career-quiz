// src/application.js

// On DOM ready: map CSV‐based FetchedJsonData into model objects and start quiz
$(document).ready(function(){
  // Question Types
  EngineNameSpace.listOfQuestionTypes = FetchedJsonData
    .QuestionTypesSpreadsheet
    .map(item => new QuestionType({
      id:   item.id,
      text: item.text
    }));

  // Answers
  EngineNameSpace.listOfAnswers = FetchedJsonData
    .AnswersSpreadsheet
    .map(item => new Answer({
      id:   item.id,
      text: item.text
    }));

  // Questions
  EngineNameSpace.listOfQuestions = FetchedJsonData
    .QuestionsSpreadsheet
    .map(item => new Question({
      id:             item.id,
      text:           item.text,
      questionTypeId: item.questionTypeId
    }));

  // Choices
  EngineNameSpace.listOfChoices = FetchedJsonData
    .ChoicesSpreadsheet
    .map(item => new Choice({
      id:             item.id,
      questionId:     item.questionId,
      text:           item.text,
      answerId:       item.answerId,
      questionTypeId: item.questionTypeId
    }));

  // Kick off
  EngineNameSpace.currentQuestion = 0;
  QuizRunner.showNextQuestion();

  // Submit handler
  $('#submit-choice').click(function(e){
    e.preventDefault();
    const checked = $('#questionnaire input[type=radio]:checked');
    if (!checked.length) {
      $('#error-field').show();
    } else {
      $('#error-field').hide();
      QuizRunner.pushChosenChoice( checked.val() );
      QuizRunner.showNextQuestion();
    }
  });
});
