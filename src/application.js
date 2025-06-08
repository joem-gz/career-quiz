// application.js
$(document).ready(function(){

  // 1) map each CSV-row object into its model
  EngineNameSpace.listOfQuestionTypes = FetchedJsonData.QuestionTypesSpreadsheet.map(function(item){
    return new QuestionType({ id: item.id, text: item.text });
  });

  EngineNameSpace.listOfAnswers = FetchedJsonData.AnswersSpreadsheet.map(function(item){
    return new Answer({ id: item.id, text: item.text });
  });

  EngineNameSpace.listOfQuestions = FetchedJsonData.QuestionsSpreadsheet.map(function(item){
    return new Question({
      id: item.id,
      text: item.text,
      questionTypeId: item.questionTypeId
    });
  });

  EngineNameSpace.listOfChoices = FetchedJsonData.ChoicesSpreadsheet.map(function(item){
    return new Choice({
      id:             item.id,
      questionId:     item.questionId,
      text:           item.text,
      answerId:       item.answerId,
      questionTypeId: item.questionTypeId
    });
  });

  // 2) start the quiz
  EngineNameSpace.currentQuestion = 0;
  QuizRunner.showNextQuestion();

  // 3) handle the “Next” button
  $('#submit-choice').click(function(event){
    event.preventDefault();
    var $checked = $('#questionnaire input[type=radio]:checked');
    if (!$checked.length) {
      $('#error-field').show();
    } else {
      $('#error-field').hide();
      QuizRunner.pushChosenChoice($checked.val());
      QuizRunner.showNextQuestion();
    }
  });
});
