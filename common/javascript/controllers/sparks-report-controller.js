/*globals console sparks $ breadModel getBreadBoard */

(function() {
  
  /*
   * Sparks Report Controller can be accessed by the
   * singleton variable sparks.sparksReportController
   *
   * There is only one singlton sparks.sparksReport object. This
   * controller creates it when the controller is created.
   */
  sparks.SparksReportController = function(){
    sparks.sparksReport = new sparks.SparksReport();
    sparks.sparksReport.view = new sparks.SparksReportView();
  };
  
  sparks.SparksReportController.prototype = {
    
    addNewSessionReport: function(page){
      var sessionReport = new sparks.SparksSessionReport();
      
      var jsonQuestions = [];
      var score = 0;
      var maxScore = 0;
      $.each(page.questions, function(i, question){
        
        sparks.sparksQuestionController.gradeQuestion(question);
        
        score += question.points_earned;
        maxScore += question.points;
        
        jsonQuestions.push(question.toJSON());
      });
      sessionReport.questions = jsonQuestions;
      sessionReport.score = score;
      sessionReport.maxScore = maxScore;
      sessionReport.log = sparks.sparksLogController.currentLog;
      
      this._addSessionReport(page, sessionReport);
      return sessionReport;
    },
    
    _addSessionReport: function(page, sessionReport) {
      if (!sparks.sparksReport.pageReports[page]){
        var pageReport = new sparks.SparksPageReport();
        sparks.sparksReport.pageReports[page] = pageReport;
        sparks.sparksReport.pageReports[page].sessionReports = [];
      }
      
      sparks.sparksReport.pageReports[page].sessionReports.push(sessionReport);
    },
    
    getLastSessionReport: function(page) {
      if (!sparks.sparksReport.pageReports[page]){
        console.log("ERROR: No session reports for page");
        return;
      }
      
      var sessionReports = sparks.sparksReport.pageReports[page].sessionReports;
      return sessionReports[sessionReports.length - 1];
    },
    
    getBestSessionReport: function(page) {
      if (!sparks.sparksReport.pageReports[page]){
        console.log("ERROR: No session reports for page");
        return;
      }
      
      var sessionReports = sparks.sparksReport.pageReports[page].sessionReports;
      var bestSessionReport = null;
      var topScore = -1;
      for (var i in sessionReports) {
        var report = sessionReports[i];
        if (report.score >= topScore){       // >= because we want to get *last* top score
          topScore = report.score;
          bestSessionReport = report;
        }
      }
      return bestSessionReport;
    },
    
    showTutorial: function (url) {
      window.open(url,'','menubar=no,height=600,width=800,resizable=yes,toolbar=no,location=no,status=no');
      sparks.sparksLogController.addEvent(sparks.LogEvent.CLICKED_TUTORIAL, url);
    },

    saveData: function() {
      if (!!sparks.activity.dataService){
        var data = sparks.sparksReport.toJSON();
        sparks.activity.dataService.save(data);
      }
    }
    
  };
  
  sparks.sparksReportController = new sparks.SparksReportController();
})();