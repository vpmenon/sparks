/*globals console sparks $ breadModel getBreadBoard */

(function() {
  
  /*
   * Sparks Page Controller can be accessed by the
   * singleton variable sparks.sparksQuestionController
   */
  sparks.SparksQuestionController = function(){
  };
  
  sparks.SparksQuestionController.prototype = {
    
    reset: function() {
      this._id = 0;
      this._subquestionId = 0;
      this._shownId = 0;
    },
    
    createQuestionsArray: function(jsonQuestions) {
      var questionsArray = [];
      var self = this;
      $.each(jsonQuestions, function(i, jsonQuestion){
        self.createQuestion(jsonQuestion, questionsArray);
      });
      
      return questionsArray;
    },
    
    _id: 0,
    
    _subquestionId: 0,
    
    _shownId: 0,
    
    createQuestion: function(jsonQuestion, questionsArray) {
      var self = this;
      
      
      function addSingleQuestion(jsonQuestion, preprompt){
        var question = new sparks.SparksQuestion();
        
        question.id = self._id;
        question.answer = '';
        question.shownId = self._shownId;
        self._id++;
        
        var oldPrompt = jsonQuestion.prompt;
        if (!!preprompt){
          question.prompt = preprompt + " " + jsonQuestion.prompt;
          question.commonPrompt = preprompt;
          question.isSubQuestion = true;
          question.subquestionId = self._subquestionId;
        } else {
          question.prompt = jsonQuestion.prompt;
        }
        
        question.shortPrompt = !!jsonQuestion.shortPrompt ? jsonQuestion.shortPrompt : question.prompt;
        
        function html_entity_decode(str) {
          return $("<div>").html(str).text();
        }
        
        // convert correct_answer (and units, if approp) to engineering format
        if (!!jsonQuestion.correct_units){
          // if auth specified units separately, we have to do it in two steps
          question.correct_answer = sparks.mathParser.calculateMeasurement(jsonQuestion.correct_answer);
          if (!isNaN(Number(question.correct_answer))){
            var converted = sparks.unit.toEngineering(question.correct_answer, jsonQuestion.correct_units);
            question.correct_answer = converted.value;
            question.correct_units = sparks.mathParser.standardizeUnits(converted.units);
          }
        } else if (!!jsonQuestion.correct_answer){
          question.correct_answer = sparks.mathParser.calculateMeasurement(jsonQuestion.correct_answer);
        }
        
        if (!!question.correct_units){
          question.correct_units = question.correct_units.replace("ohms",html_entity_decode("&#x2126;"));
        }
        
        if (!!jsonQuestion.options){
          question.options = [];
          $.each(jsonQuestion.options, function(i, choice){
            question.options[i] = {};
            if (!!jsonQuestion.options[i].option){
              question.options[i].option = ""+jsonQuestion.options[i].option;
              question.options[i].option = sparks.mathParser.calculateMeasurement(question.options[i].option);
              question.options[i].points = jsonQuestion.options[i].points > 0 ? jsonQuestion.options[i].points : 0;
              question.options[i].feedback = jsonQuestion.options[i].feedback || "";
              question.options[i].tutorial = jsonQuestion.options[i].tutorial || "";
            } else {
              question.options[i] = sparks.mathParser.calculateMeasurement(choice);
            }
          });
          if (jsonQuestion.radio){
            question.radio = true;
          } else if (jsonQuestion.checkbox){
            question.checkbox = true;
          }
          if (jsonQuestion.keepOrder){
            question.keepOrder = true;
          }
        }
        
        question.points = (jsonQuestion.points | 1);
        question.image = jsonQuestion.image;
        question.top_tutorial = jsonQuestion.tutorial;
        
        
        question.scoring = jsonQuestion.scoring;
        
        // for now we put it in both places.
        questionsArray.push(question);
        
        question.prompt = oldPrompt;
        
        question.view = new sparks.SparksQuestionView(question);
      }
      
      if (!jsonQuestion.subquestions){
        addSingleQuestion(jsonQuestion);
      } else {
        $.each(jsonQuestion.subquestions, function(i, subquestion){
          addSingleQuestion(subquestion, jsonQuestion.prompt);
        });
        this._subquestionId++;
      }
      this._shownId++;
    },
    
    gradeQuestion: function(question) {
      if (!!question.scoring){
        var parsedScoring = sparks.mathParser.replaceCircuitVariables(question.scoring);
        eval("var functionStr = function(question){" + parsedScoring + "}");
        functionStr(question);
      } else if (!question.options || !question.options[0].option) {
        if (""+question.answer === ""+question.correct_answer){
          question.points_earned = question.points;
        } else {  
          question.points_earned = 0;
        }
      } else {
        var maxPoints = 0;
        $.each(question.options, function(i, option){
          if (option.option === question.answer){
            question.points_earned = option.points;
            question.feedback = option.feedback;
            if (!!option.tutorial) {
              question.tutorial = option.tutorial;
            } else {
              question.tutorial = question.top_tutorial;
            }
            
          }
          var points = option.points;
          if (points > maxPoints){
            maxPoints = points;
            question.points = points;
            question.correct_answer = option.option;
          }
        });
      }
      
      if (question.answerIsCorrect){
        question.tutorial = null;
      }
      
      question.answerIsCorrect = (question.points_earned == question.points);
      
      if (question.points_earned < 0) {
        question.points_earned = 0;
      }
    }
    
  };
  
  sparks.sparksQuestionController = new sparks.SparksQuestionController();
})();