$(document).ready( function(){
  EngineNameSpace.listOfQuestionTypes = FetchedJsonData.QuestionTypesSpreadsheet.map(function(item) {
    return new QuestionType({
      id: item.id,
      text: item.text,
      active: item.active
    });
  });

  EngineNameSpace.listOfAnswers = FetchedJsonData.AnswersSpreadsheet.map(function(item) {
    return new Answer({
      id: item.id,
      text: item.text,
      active: item.active
    });
  });

  EngineNameSpace.listOfQuestions = FetchedJsonData.QuestionsSpreadsheet.map(function(item) {
    return new Question({
      id: item.id,
      text: item.text,
      questionTypeId: item.questionTypeId,
      active: item.active
    });
  });

  EngineNameSpace.listOfChoices = FetchedJsonData.ChoicesSpreadsheet.map(function(item) {
    return new Choice({
      id: item.id,
      questionId: item.questionId,
      text: item.text,
      answerId: item.answerId,
      questionTypeId: item.questionTypeId,
      active: item.active
    });
  });

  EngineNameSpace.currentQuestion = 0;
  QuizRunner.showNextQuestion();

  $('#submit-choice').click(function(event){
    event.preventDefault();
    var radioChecked = $('#questionnaire input[type=radio]:checked');
    if ( radioChecked.length === 0  ){
      $("#error-field").show();
    }
    else {
      $("#error-field").hide();
      QuizRunner.pushChosenChoice(radioChecked[0].value);
      QuizRunner.showNextQuestion();
    }
  });
});
