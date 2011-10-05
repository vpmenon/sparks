/*globals console sparks $ breadModel getBreadBoard */

(function() {
  
  sparks.ActivityView = function(activity){
    this.activity = activity;
    
    this.divs = {
      $breadboardDiv: $('#breadboard'),
      $imageDiv: $('#image'),
      $questionsDiv: $('#questions_area'),
      $titleDiv: $('#title')
    };
  };
  
  sparks.ActivityView.prototype = {
    
    layoutCurrentSection: function() {
      var section = sparks.activityController.currentSection;
      
      $('#loading').hide();

      this.divs.$titleDiv.text(section.title);
      
      this.divs.$imageDiv.html('');
      
      if (!!section.image){
        var $image = sparks.activityController.currentSection.view.getImageView();
        this.divs.$imageDiv.append($image);
      }

      if (!!section.circuit && !section.hide_circuit){
        if (sparks.flash.loaded){
          sparks.flash.loaded = false;
          this.divs.$breadboardDiv.html('');
        }
        this.loadFlash();
        breadModel('updateFlash');
        if (section.show_multimeter){
          sparks.flash.sendCommand('set_multimeter_visibility','true');
          sparks.flash.sendCommand('set_probe_visibility','true');
        }
      }

      this.layoutPage();
    },
    
    layoutPage: function() {
      if (!!sparks.sectionController.currentPage){
        this.divs.$questionsDiv.html('');
        var $page = sparks.sectionController.currentPage.view.getView();
        this.divs.$questionsDiv.append($page);
      }
      $('body').scrollTop(0);
    },

    loadFlash: function () {
       this.divs.$breadboardDiv.css("z-index", 0);
       this.divs.$breadboardDiv.flash({
           src: 'activities/module-2/breadboardActivity1.swf',
           id: 'breadboardActivity1',
           name: 'breadboardActivity1',
           width: 900,
           height: 600,
           quality: 'high',
           allowFullScreen: false,
           allowScriptAccess: 'sameDomain',
           wmode: 'transparent'
       });
     },
     
     // not usually necessary. Justs for tests?
     setEmbeddingTargets: function(targets) {
       if (!!targets.$breadboardDiv){
         this.divs.$breadboardDiv = targets.$breadboardDiv;
       }
       if (!!targets.$imageDiv){
         this.divs.$imageDiv = targets.$imageDiv;
       }
       if (!!targets.$questionsDiv){
         this.divs.$questionsDiv = targets.$questionsDiv;
       }
     }
  };
})();