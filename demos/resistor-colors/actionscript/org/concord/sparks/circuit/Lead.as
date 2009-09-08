package org.concord.sparks.circuit
{
    import flash.events.Event;
    import flash.events.MouseEvent;
    import org.concord.sparks.Activity;
    
    public class Lead
    {
        // Global coordinates of the end point of the lead
        public var x:Number;
        public var y:Number;

        var displayObject;
        
        // Offset used to calculate global coordinates of the end point
        var xOffset:Number;
        var yOffset:Number;
        
        // Local coordinates of the end point of the lead
        var endLocalX:Number; 
        var endLocalY:Number;
        
        var mouseDown:Boolean; 
        
        public function Lead(displayObject, endLocalX:Number, endLocalY:Number) {
            this.displayObject = displayObject;
            this.endLocalX = endLocalX;
            this.endLocalY = endLocalY;
            displayObject.addEventListener(MouseEvent.MOUSE_DOWN, handleMouseDown);
            displayObject.addEventListener(MouseEvent.MOUSE_UP, handleMouseUp);
            displayObject.addEventListener(MouseEvent.MOUSE_MOVE,handleMouseMove);
        }
        
        function handleMouseDown(event:MouseEvent):void {
            mouseDown = true;
            xOffset = endLocalX - event.localX;
            yOffset = endLocalY - event.localY;
            displayObject.startDrag();
        }

        function handleMouseUp(event:Event):void {
            displayObject.stopDrag();
            mouseDown = false;
            //Activity.resistor.hideHighlights();
            trace("TODO: handlemouseup")
        }
        
        function handleMouseMove(event:MouseEvent):void {
            if (mouseDown) {
                x = event.stageX + xOffset;
                y = event.stageY + yOffset;
                //Activity.resistor.showHighlight(x, y);
                trace("TODO: handlemousemove")
            }
        }
    }
}