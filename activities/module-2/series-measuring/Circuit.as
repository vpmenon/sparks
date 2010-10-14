package {    import flash.display.MovieClip;    import flash.geom.Point;    import flash.media.Sound;    import flash.media.SoundChannel;    import flash.media.SoundTransform;        import org.concord.sparks.JavaScript;    import org.concord.sparks.circuit.multimeter.dmm_centech.DmmCentech2;	import Resistor4Band;	import Resistor5Band;	import Breadboard;    public class Circuit {        private var activity;        private var root;        private var breadboard:MovieClip;        private var multimeter:DmmCentech2;        private var redProbe:Probe;        private var blackProbe:Probe;        private var resistors:Array = new Array();		//private var outer_breadboard:ComponentBreadboard;                private var sndClickIt:clickit3;        private var sndClickItChannel:SoundChannel;        private var transform1:SoundTransform=new SoundTransform();				private var breadboardMC:ComponentBreadboard;// = root.battery_mc;		//private var dmmMC:ComponentMultimeter;// = root.dmm_mc;		//private var batteryMC:ComponentBattery;// = root.outer_breadboard_mc;        public function Circuit(activity, root) {            this.activity = activity;            this.root = root;            breadboard = root.outer_breadboard_mc.breadboard_mc;			            multimeter = new DmmCentech2({ activity: activity, root: root });            redProbe = breadboard.probe_red;            redProbe.setCircuit(this);            blackProbe = breadboard.probe_black;            blackProbe.setCircuit(this);            resistors.push(breadboard.resistor1);            resistors.push(breadboard.resistor2);            resistors.push(breadboard.resistor3);                        multimeter.setDisplayText('  9.0 0');						breadboardMC = root.outer_breadboard_mc;			breadboardMC.expandOnFocus.setStartX(breadboardMC.x);			breadboardMC.expandOnFocus.setStartY(breadboardMC.y);			
			//resistors can be added from the javascript as follows:
			//flash.sendCommand('insert_component','resistor','d29,b17','5band','green,blue,blue,red,red');
			//
			//or from the actionscript as follows:					//insertComponent('resistor','d29,b17','5band','green,blue,blue,red,red');        }		public function insertComponent(componentName:String,position:String, ...values):String {			switch(componentName) {				case 'resistor':					//...values					var type:String = values[0];					var colorsArr:Array = values[1].toString().split(",");										var i:int = resistors.length;  // get length for new resistor array					if(type == '4band') {						resistors[i] = new resistorFourBand_mc;					} else if(type == '5band') {						resistors[i] = new resistorFiveBand_mc;					}					resistors[i].setColorBands(colorsArr);					positionComponent(componentName, resistors[i], position);
					resistors[i].name = 'resistor'+(i+1);
					trace(resistors[i].name);					//breadboard.addChildAt(resistors[i],breadboard.numChildren);  // need to fix the level here to be the highest without being on top of probes					breadboard.addChildAt(resistors[i],400);					JavaScript.instance().sendEvent('inserted resistor');				break;				case 'multimeter':				break;				case 'battery':				break;				case 'wire':				break;			}			return '';		}		private function parseCoordinates(coordinateStr:String) { //takes a string of two coordinates and outputs in a two dimensional array with row/hole count, such that [0][0] = x1, [0][1] = y1, [1][0] = x2, [1][1] = y2			var tempCoordinates:Array = coordinateStr.split(",");  // 'a6,a12' -> ['a6','a12']			var coordinatesArr:Array = new Array();						for(var i:int = 0; i<2; i++){				var coordinate:String = tempCoordinates[i];				coordinatesArr[i] = new Array(coordinate.substring(0,1),coordinate.substring(1,coordinate.length)); //for each element: 'a6' -> [a][6]				var rowLabels:Array = new Array("a","b","c","d","e","f","g","h","i","j"); //,"k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"				coordinatesArr[i][0] = rowLabels.indexOf(coordinatesArr[i][0])+1; //convert row letter to row number, 'a' = 1, 'b' = 2, etc.    [a][6] -> [1][6]			}			return coordinatesArr;		}				private function positionComponent(componentName:String, componentObj:MovieClip, position:String) {  //  ( 'resistor', [object] , 'a6,b12' )			var xPos:Number;			var yPos:Number;			switch(componentName) {				case 'resistor':					var coordinates:Array = parseCoordinates(position); // string 'a6,b12' -> 2d array [0][0] = 1, [0][1] = 6, [1][0] = 2, [1][1] = 12					var holeNum:int = coordinates[0][1];					var rowNum:int = coordinates[0][0];					xPos = breadboard.getRows()[rowNum][holeNum].x + breadboard.holeSize/2;					yPos = breadboard.getRows()[rowNum][holeNum].y + breadboard.holeSize/2;				break;				case 'multimeter':				break;				case 'battery':				break;				case 'wire':				break			}			componentObj.x = xPos;			componentObj.y = yPos;		}										           public function getResistor(id:String) {            return breadboard[id];        }                public function getMultimeter():DmmCentech2 {            return multimeter;        }        public function updateProbeConnection(probe:Probe):void {            trace('ENTER Circuit#updateProbeConnection');            var oldConnection:Object = probe.getConnection();            var connection:Object = null;            var ends;                        for (var i = 0; i < resistors.length; ++i) {                ends = resistors[i].getEnds();                for (var j = 0; j < 2; ++j) {                    if (ends[j].isBroken()) {                        if (ends[j].inBrokenHotSpot(probe)) {                            connection = ends[j];                            ends[j].setBrokenEngaged();                        }                    }                    else {                        if (ends[j].inHotSpot(probe.getTipPos())) {                            connection = ends[j];                            ends[j].setEngaged();                        }                    }                }            }                        if (connection !== oldConnection) {                clickSound();                probe.setConnection(connection);                JavaScript.instance().sendEvent('connect', 'probe', probe.getId(), connection.getLocation());            }        }                public function updateResistorEndColors(probe:Probe):void {            //trace('ENTER Circuit#updateResistorEndColor');			            var ends;            for (var i = 0; i < resistors.length; ++i) {                ends = resistors[i].getEnds();                for (var j = 0; j < 2; ++j) {                    if (ends[j].isBroken()) {                        if (ends[j].inBrokenHotSpot(probe)) {                            if (ends[j].getBrokenState() !== ResistorLead.ROLL_OVER) {                                ends[j].setBrokenRollOver();                            }                        }                        else {                            if (!probeConnected(ends[j]) && ends[j].getBrokenState() !== ResistorLead.ORIGINAL) {                                ends[j].setBrokenOriginal();                            }                        }                    }                    else {                        if (ends[j].inHotSpot(probe.getTipPos())) {                            if (ends[j].getState() !== ResistorLead.ROLL_OVER) {                                ends[j].setRollOver();                            }                        }                        else {                            if (!probeConnected(ends[j]) && ends[j].getState() !== ResistorLead.ORIGINAL) {                                ends[j].setOriginal();                            }                        }                    }                }            }        }                private function probeConnected(end:ResistorLead):Boolean {            return redProbe.getConnection() == end || blackProbe.getConnection() == end;        }        private function clickSound():void {            sndClickIt=new clickit3();            sndClickItChannel=sndClickIt.play();             transform1.volume=.75;            sndClickItChannel.soundTransform=transform1;        }    }}