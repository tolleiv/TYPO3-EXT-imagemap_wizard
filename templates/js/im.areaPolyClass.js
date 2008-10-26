
var areaPolyClass = areaClass.extend({
    _coords:-1,

    initCoords: function(coords) {
        if(typeof coords == 'undefined') { return; }
        this._coords = new Array();
    	var tmpCoords = coords.split(",");        
        for(var i=0;i<tmpCoords.length;i=i+2) {
            this.addCoord(tmpCoords[i],tmpCoords[i+1],false);
        }
    },

    // called from canvasClass
	persistanceXML: function() {
		return "<area shape=\"poly\" coords=\""+this.joinCoords()+"\" alt=\"" + this.getLabel() + "\" color=\""+this.getColor()+"\">"+this.getLink()+"</area>";
	},

    // called from canvasClass
    drawSelection: function(vectorsObj) {
            vectorsObj.setStroke(1);
            for(var i=0;i<this._coords.length;i++) {
                var x1 = this._coords[i].x;
                var y1 = this._coords[i].y;
                var x2 = this._coords[((i>0)?i:this._coords.length)-1].x;
                var y2 = this._coords[((i>0)?i:this._coords.length)-1].y;
                vectorsObj.setColor(this.getColor());
                vectorsObj.drawLine(x1,y1,x2,y2);
            }
            
            for(var i=0;i<this._coords.length;i++) {
                this.drawEdge(vectorsObj,this._coords[i].x,this._coords[i].y);
            }
    },
    
    // called from canvasClass
    formMarkup: function(formBlueprints) {
        return this.getCanvas().getFormBlueprint("polyForm").replace(/MAPFORMID/g,this.getFormId())
                     								 .replace(/MAPAREAVALUE_URL/g,escape(this.getLink()))
                     								 .replace(/MAPAREAVALUE/g,this.getLink())
                     								 .replace(/POLYCOORDS/g,this.coordMarkup());
    },

    coordMarkup: function() {
        var result = "";
        var tmpMarkup = this.getCanvas().getFormBlueprint("polyCoords");
        for(var i=0;i<this._coords.length;i++) {
            result = result + tmpMarkup.replace(/MAPFORMID/g,this.getFormId())
                                .replace(/N/g,i)
                                .replace(/vX/g,this._coords[i].x)
                                .replace(/vY/g,this._coords[i].y);
        }
        return result;
    },

    // called from canvasClass
    formUpdate: function() {    
        var result = "";
        for(var i=0;i<this._coords.length;i++) {
            result = result  + this.getFormId() + "_x" + i + "=" + this._coords[i].x + ";";
            result = result  + this.getFormId() + "_y" + i + "=" + this._coords[i].y + ";";
        }    
        result = result  + this.getFormId() + "_link=" + this.getLink() + ";";
        result = result  + this.getFormId() + "_label=" + this.getLabel() + ";";
        return result;
    },    
    
    applyBasicTypeActions: function() {
        $("#" + this.getFormId() + "_add")
           	.data("obj",this)
            .click(function(event) {
                $(this).data("obj").insertNewCoordAfterPoint(-1);
        });    
    },
    
    applyAdditionalTypeActions: function() {   
        $("#" + this.getFormId() + "_more > .positionOptions > .addCoord")
            .data("obj",this)
            .click(function(e) {
                if(this.id.match(/^.*_after\d+$/)) {
                    $(this).data("obj").insertNewCoordAfterPoint(parseInt(this.id.replace(/^.*_after/g,'')));
                } 
                if(this.id.match(/^.*_before\d+$/)) {
                    $(this).data("obj").insertNewCoordBeforePoint(parseInt(this.id.replace(/^.*_before/g,'')));
                } 
            });
        $("#" + this.getFormId() + "_more > .positionOptions > .rmCoord")
            .data("obj",this)
            .click(function(e) {
                $(this).data("obj").removeCoord(parseInt(this.id.replace(/^.*_rm/g,'')));
            });
    },
    
    updateCoordsFromForm: function(id) {
       for(var i=0;i<this._coords.length;i++) {
            this._coords[i].x = parseInt($("#" + this.getFormId() + "_x" + i).val());
            this._coords[i].y = parseInt($("#" + this.getFormId() + "_y" + i).val());
       }
        this.getCanvas().updateCanvas(this.getId());
    },

 
    hitOnObjectEdge: function(mouseX,mouseY,edgeSize) {
        var result = -1;
        for(var i=0;i<this._coords.length;i++) {
            if((result == -1) && this.hitEdge(mouseX,mouseY,this._coords[i].x,this._coords[i].y,edgeSize)) {
                result = i;
            }
        } 
        return result;
    },
    
       
    performResizeAction: function(edge,x,y) {
        
        if(edge>=0 && edge<this._coords.length) {
            this._coords[edge].x=x;
            this._coords[edge].y=y;
        }
        
        return edge;
    },
    
    addCoord: function(cX,cY) {
        this._coords.push({x:parseInt(cX), y:parseInt(cY)});
    },   

    insertNewCoordAfterPoint: function(p) {
        var p1,p2,max;
        max = this._coords.length-1;
        if(p==-1 || p>=max)  {
            p1 = 0;
            p2 = max;
        } else {
            p1 = p;
            p2 = p+1;
        }
        var cX = (this._coords[p1].x+this._coords[p2].x)/2;
        var cY = (this._coords[p1].y+this._coords[p2].y)/2;
        
        if( p1==0 && p2==max) {
            this.addCoord(cX,cY);
        } else {
            this._coords.splice(p2,0, {x:parseInt(cX), y:parseInt(cY)});            
        }
        this.getCanvas().updateCanvas(this.getId());
        this.getCanvas().refreshForm(this.getId());        
    },

    insertNewCoordBeforePoint: function(p) {
        this.insertNewCoordAfterPoint(p-1);
    },
    
    removeCoord: function(i) {
        if(this._coords.length > 3) {
            this._coords.splice(i,1);
            this.getCanvas().updateCanvas(this.getId());
            this.getCanvas().refreshForm(this.getId());
        } else {
            alert("Polygone needs to have at least 3 Edges");
        }
    },

    joinCoords: function() {
        var result = "";
        for(var i=0;i<this._coords.length;i++) {
            result = result + (result.length?",":"") + this._coords[i].x + "," + this._coords[i].y;
        }
        return result;
    }

});