//= require jquery/plugins/jquery.nearest

/*global sparks $ */

(function() {

  embeddableComponents = {
    resistor: {
      image: "common/images/blank-resistor.png",
      imageWidth: 108,
      property: "resistance",
      initialValue: 100
    }
  }

  sparks.AddComponentsView = function(section){
    var self = this,
        component;

    this.section = section;
    this.$drawer = $("#component_drawer").empty();

    this.lastHighlightedHole = null;

    // create drawer
    for (componentName in embeddableComponents) {
      if (!embeddableComponents.hasOwnProperty(componentName)) continue;

      component = embeddableComponents[componentName];

      this.$drawer.append(
       $("<img id='add_"+componentName+"' class='add_component'>")
        .attr("src", component.image)
        .css("width", component.imageWidth)
        .data("type", componentName)
        .draggable({
          containment: "#breadboard_wrapper",
          helper: "clone",
          start: function(evt, ui) {
            $(ui.helper.context).hide().fadeIn(1200);
          },
          drag: function(evt, ui) {
            if (self.lastHighlightedHole) {
              self.lastHighlightedHole.attr("xlink:href", "#$:hole_not_connected");
            }
            loc = {x: ui.offset.left, y: ui.offset.top+(ui.helper.height()/2)};
            var nearestHole = $($.nearest(loc, "use[hole]")[0]);
            nearestHole.attr("xlink:href", "#$:hole_highlighted");
            self.lastHighlightedHole = nearestHole;
          }
        })
      );
    }

    // todo: don't add this twice
    $("#breadboard").droppable({
      drop: function(evt, ui) {
        var type = ui.draggable.data("type"),
            embeddableComponent = embeddableComponents[type],
            section = sparks.activityController.currentSection,
            hole = self.lastHighlightedHole.attr("hole"),
            loc = hole + "," + hole,
            possibleValues,
            $propertyEditor = null,
            initialValueEng, initialValueText,
            $editor, props, uid, comp;

        // insert component into highlighted hole
        props = {
         "type": type,
         "draggable": true,
         "connections": loc
        };
        props[embeddableComponent.property] = embeddableComponent.initialValue;
        uid = breadModel("insertComponent", type, props);

        comp = getBreadBoard().components[uid];

        // move leads to correct width
        breadModel("checkLocation", comp);

        // update meters
        section.meter.update();

        // create editor tooltip
        possibleValues = comp.getEditablePropertyValues();

        componentValueChanged = function (evt, ui) {
          var val = possibleValues[ui.value],
              eng = sparks.unit.toEngineering(val, comp.editableProperty.units);
          $("#prop_value").text(eng.value + eng.units);
          comp.changeEditableValue(val);
          section.meter.update();
        }

        if (comp.isEditable) {
          initialValueEng = sparks.unit.toEngineering(embeddableComponent.initialValue, comp.editableProperty.units);
          initialValueText = initialValueEng.value + initialValueEng.units;
          $propertyEditor = $("<div>").append(
            $("<div>").slider({
              max: possibleValues.length-1,
              slide: componentValueChanged,
              value: possibleValues.indexOf(embeddableComponent.initialValue)
            })
          ).append(
            $("<div>").html(
              comp.editableProperty.name + ": <span id='prop_value'>"+initialValueText+"</span>"
              )
          );
        }

        $editor = $("<div class='editor'>").append(
          $("<h3>").text("Edit "+comp.componentTypeName)
        ).append(
          $propertyEditor
        ).append(
          $("<button>").text("Remove").on('click', function() {
            breadModel("removeComponent", comp);
            section.meter.update();
            $(".speech-bubble").trigger('mouseleave');
          })
        ).css( { width: 130, textAlign: "right" } );

        sparks.breadboardView.showTooltip(uid, $editor);
      }
    })
  };

  sparks.AddComponentsView.prototype = {

    openPane: function() {
      $("#component_drawer").animate({left: 0}, 300, function(){
        $("#add_components").css("overflow", "visible");
      });
    }

  };
})();