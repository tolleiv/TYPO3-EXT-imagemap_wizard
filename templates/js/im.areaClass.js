var areaClass = Class.extend({
    _id:-1,
    _link:-1,
    _label:'',
    _canvas:-1,
    _moreOptionsInitFlag:false,
    _moreOptionsVisible:false,
	_colors:    ['990033','ff9999','993366','ff66cc','ff0066','ff00cc','cc0099','cc99ff','cc00cc','cc99cc','9933cc','9966cc','6600cc','6633ff','6666cc','333399','3333ff',		
		        '3366ff','0000ff','336699','003366','0099cc','0099ff','66ffff','009999','33cccc','006666','33cc99','00ff99','669966','339933','33cc66','009933',		
		        'ccff99','00ff00','009900','66cc00','99cc66','669900','ccff00','333300','666633','ffff99','ffcc00','996600','993300','ff6633','996633','cc9999',		
		        'ff3333','990000','cc9966', 'eeeeee','999999','666666','333333','000000'],
    
    // called from canvasClass
    init: function(canvas,id,coords,label,link,color) {
        this._canvas = canvas;
        this._id = id;
        this.setLabel(label);
        this.setLink(link);
		this.setColor(color);
        this.initCoords(coords);        
    },
    
    remove: function() {
        $("#" + this.getFormId()).remove();
        this.getCanvas().removeArea(this.getId());
    },
    
    getCanvas: function() { 
        return this._canvas;
    },
    
    setLabel: function(label) {
        this._label = label;
    },
    
    getLabel: function() {
        return this._label;
    },
    
    setLink: function(link) {
        this._link = link;
    },
    
    getLink: function() {
        return this._link;
    },
    
    _color:-1,
    setColor: function(color) {    
        this._color = ((typeof color =='string') && color.match(/^#\S{6}$/g))?color:("#" + this._colors[parseInt(Math.random()*57)])    
    },

    updateColor: function(color,updateCanvas) {
  		        this.setColor(color);
		        $("#" + this.getFormId() + "_main > .colorPreview > div").css("backgroundColor", color);
		        $("#" + this.getFormId() + "_color > .colorBox > div").css("backgroundColor", color);
		        if(updateCanvas==1) this.getCanvas().updateCanvas(this.getId());
    },
    
    getColor: function() {
        return this._color;
    },

    drawEdge: function(vectorsObj,x,y) {
        vectorsObj.setColor(this.getColor());    
        vectorsObj.fillRect(x-3,y-3,7,7);
        vectorsObj.setColor("#ffffff");
        vectorsObj.fillRect(x-2,y-2,5,5);      
    },

    // called from canvasClass
	// most of the operations can't be called earlier since we need the form-markup to be loaded
    applyBasicAreaActions: function() {
    	this._moreOptionsInitFlag = false;
        $("#" + this.getFormId() + "_upd").data("area",this).click(function(event) {
            $(this).data("area").updateCoordsFromForm();
        });
        $("#" + this.getFormId() + "_del").data("area",this).click(function(event) {
            $(this).data("area").remove();
        });
        $("#" + this.getFormId() + " > .basicOptions > .exp > img")
        	.data("obj",this)
        	.data("rel","#" + this.getFormId() +" > .moreOptions")
        	.click(function(event) {
               // if ($($(this).data("rel")).is(":hidden")) {
               if(!$(this).data("obj").isMoreOptionsVisible()) {
                    $(this).data("obj").applyAdditionalAreaActions();
                    $($(this).data("rel")).slideDown("fast");
                } else {
                    $($(this).data("rel")).slideUp("fast");
                }
                $(this).data("obj").toogleMoreOptionsFlag();        
        });
        $("#" + this.getFormId() + " > .basicOptions > .colorPreview")
        	.data("pseudo","#" + this.getFormId() + " > .basicOptions > .exp > img")
            .click(function(event) {
                $($(this).data("pseudo")).click();
            });
        $("#" + this.getFormId() + "_link")
           	.data("obj",this)
    	    .change(function(event) {
    	        $(this).data("obj").updateStatesFromForm();
    	    });
        $("#" + this.getFormId() + "_up")
           	.data("obj",this)
            .click(function(event) {
            $(this).data("obj").getCanvas().areaUp($(this).data("obj").getId());
        });
        $("#" + this.getFormId() + "_down")
           	.data("obj",this)
            .click(function(event) {
            $(this).data("obj").getCanvas().areaDown($(this).data("obj").getId());
        });
        
        this.applyBasicTypeActions();
        
        if(!this._moreOptionsVisible)	$("#" + this.getFormId() + " > .moreOptions").hide();
		else						this.applyAdditionalAreaActions();

        this.updateColor(this.getColor(),0);
        this.refreshExpandButtons();
    },

    updateStatesFromForm: function() {
		this.setLink(document.forms[0].elements[this.getFormId() + "_link"].value);
        this.setLabel(document.forms[0].elements[this.getFormId() + "_label"].value);
		//this._moreOptionsVisible = $("#" + this.getFormId() +" > .moreOptions").is(":visible");
    },

    applyAdditionalAreaActions: function() {
    	if(this._moreOptionsInitFlag==true) return;
        $("#" + this.getFormId() + "_color > .colorPicker")
        		.data("area",this)
        		.simpleColor({colors:this._colors})
        		.click(function(event,data) {
        			if(typeof data == 'undefined') return;
        			$(this).data("area").updateColor(data,1);
        		});
		
         this.applyAdditionalTypeActions();
        
        this._moreOptionsInitFlag=true;
    },

    refreshExpandButtons: function()    {
        $("#" + this.getFormId() + " > .basicOptions > .exp > img").hide();    
        if(this.isMoreOptionsVisible()) {
            $("#" + this.getFormId() + " > .basicOptions > .exp > img.up").show();
        } else {
            $("#" + this.getFormId() + " > .basicOptions > .exp > img.down").show();       
        }
    },

    toogleMoreOptionsFlag: function() { 
        this._moreOptionsVisible = !this._moreOptionsVisible;
        this.refreshExpandButtons();    
    },
    isMoreOptionsVisible: function()      { return this._moreOptionsVisible; },

    getId: function()         {   return this._id;  },
    getFormId: function()     {   return this.getId();   },
    
    hitEdge: function(mX,mY,bX,bY,edgeSize) {    
        return ((Math.abs(mX-bX)<=(edgeSize)) && (Math.abs(mY-bY)<=(edgeSize)));    
    }
});