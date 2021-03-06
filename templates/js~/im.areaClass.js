/*******************************************************************************
 * Copyright notice
 * 
 * (c) 2008 Tolleiv Nietsch (info@tolleiv.de) All rights reserved
 * 
 * This script is part of the TYPO3 project. The TYPO3 project is free software;
 * you can redistribute it and/or modify it under the terms of the GNU General
 * Public License as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * 
 * The GNU General Public License can be found at
 * http://www.gnu.org/copyleft/gpl.html.
 * 
 * This script is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 * 
 * This copyright notice MUST APPEAR in all copies of the script!
 ******************************************************************************/

var areaClass = Class
		.extend( {
			_id : -1,
			_link : -1,
			_label : '',
			_canvas : -1,
			_scale : 1,
			_edges : true,
			_undoStack : new Array(),
			_redoStack : new Array(),
			_moreOptionsInitFlag : false,
			_moreOptionsVisible : false,
			_attr : {},
			_colors : [ '990033', 'ff9999', 'ffccff', '993366', 'ff66cc',
					'ff0066', 'ff00cc', 'cc0099', 'cc99ff', 'ff33ff', 'cc00cc',
					'cc99cc', '9933cc', '9966cc', '6600cc', '663366', '6633ff',
					'9999ff', '6666cc', '333399', '3333ff', '3366ff', '0000ff',
					'336699', '003366', '0099cc', '0099ff', '66ffff', '009999',
					'33cccc', '006666', '33cc99', '00ff99', '669966', '339933',
					'33cc66', '009933', 'ccff99', '009900', '00ff00', '009900',
					'66cc00', '99cc66', '669900', 'ccff00', '333300', '666633',
					'ffff99', 'ffcc00', '996600', '993300', '990000', 'ff3333',
					'FF0000', 'ff6633', '996633', 'cc9999', 'cc9966', 'eeeeee',
					'999999', '666666', '333333', '000000' ],

			// called from canvasClass
			init : function(canvas, id, coords, label, link, color, attr) {
				this._canvas = canvas;
				this._id = id;
				this._attr = (typeof attr == "object") ? attr : {};
				this.setLabel(label);
				this.setLink(link);
				this.setColor(color);
				this.initCoords(coords);
			},

			remove : function() {
				jQuery("#" + this.getFormId()).remove();
				this.getCanvas().removeArea(this.getId());
			},

			getCanvas : function() {
				return this._canvas;
			},

			setLabel : function(label) {
				this._label = label;
			},

			getLabel : function() {
				return this._label;
			},

			setLink : function(link) {
				this._link = link;
			},

			getLink : function() {
				return this._link;
			},

			setScale : function(factor) {
				if (factor < 0 || factor > 1)
					return;
				this._scale = factor;
			},

			applyScale : function(value, performScale) {
				return ((performScale) ? this._scale : 1) * parseInt(value);
			},

			reverseScale : function(value) {
				return (1 / this._scale) * parseInt(value);
			},

			_color : -1,
			setColor : function(color) {
				this._color = ((typeof color == 'string') && color
						.match(/^#\S{6}$/g)) ? color
						: ("#" + this._colors[parseInt(Math.random() * 57)])
			},

			updateColor : function(color, updateCanvas) {
				this.setColor(color);
				jQuery("#" + this.getFormId() + "_main > .colorPreview > div")
						.css("backgroundColor", color);
				jQuery("#" + this.getFormId() + "_color > .colorBox > div")
						.css("backgroundColor", color);
				if (updateCanvas == 1)
					this.getCanvas().updateCanvas(this.getId());
			},

			getColor : function() {
				return this._color;
			},

			drawEdge : function(vectorsObj, x, y) {
				if (!this._edges) {
					return;
				}
				vectorsObj.setColor(this.getColor());
				vectorsObj.fillRect(x - 3, y - 3, 7, 7);
				vectorsObj.setColor("#ffffff");
				vectorsObj.fillRect(x - 2, y - 2, 5, 5);
			},

			disableEdges : function() {
				this._edges = false;
			},

			// called from canvasClass
			// most of the operations can't be called earlier since we need the
			// form-markup to be loaded
			applyBasicAreaActions : function() {
				this._moreOptionsInitFlag = false;
				jQuery("#" + this.getFormId() + "_upd").data("area", this)
						.click(function(event) {
							var that = jQuery(this).data("area");
							that.pushUndoableAction();
							that.updateCoordsFromForm();
						});
				jQuery("#" + this.getFormId() + "_del").data("area", this)
						.click(function(event) {
							jQuery(this).data("area").remove();
						});
				jQuery("#" + this.getFormId() + " > .basicOptions > .exp > .expUpDown").parent()
						.data("obj", this).data("rel",
								"#" + this.getFormId() + " > .moreOptions")
						.click(
								function(event) {
									event.stopPropagation();
									if (!jQuery(this).data("obj")
											.isMoreOptionsVisible()) {
										jQuery(this).data("obj")
												.applyAdditionalAreaActions();
										jQuery(jQuery(this).data("rel"))
												.slideDown("fast");
									} else {
										jQuery(jQuery(this).data("rel"))
												.slideUp("fast");
									}
									jQuery(this).data("obj")
											.toogleMoreOptionsFlag();

								});
				jQuery(
						"#" + this.getFormId()
								+ " > .basicOptions > .colorPreview > div")
						.data(
								"target",
								this
						)
						.click(
								function(event) {
									var that = jQuery(this).data("target");
									var upDownToggle = jQuery("#" + that.getFormId() + " > .basicOptions > .exp > .expUpDown:visible").parent();
									jQuery(upDownToggle)
											.trigger('click');
								});
				jQuery("#" + this.getFormId() + "_link").data("obj", this)
					.change(function(event) {
						jQuery(this).data("obj").updateStatesFromForm();
						var that = jQuery(this).data("obj");
						that.pushUndoableAction();
					});
				jQuery("#" + this.getFormId() + "_label").data("obj", this)
					.change(function(event) {
						jQuery(this).data("obj").updateStatesFromForm();
						var that = jQuery(this).data("obj");
						that.pushUndoableAction();
					});
				jQuery("#" + this.getFormId() + "_up").data("obj", this).click(
						function(event) {
							jQuery(this).data("obj").getCanvas().areaUp(
									jQuery(this).data("obj").getId());
						});
				jQuery("#" + this.getFormId() + "_down").data("obj", this)
						.click(
								function(event) {
									jQuery(this).data("obj").getCanvas()
											.areaDown(
													jQuery(this).data("obj")
															.getId());
								});

				jQuery("#" + this.getFormId() + "_undo").data("obj", this)
						.click(function(event) {
							jQuery(this).data("obj").performUndo();
						});

				jQuery("#" + this.getFormId() + "_redo").data("obj", this)
						.click(function(event) {
							jQuery(this).data("obj").performRedo();
						});

				this.applyBasicTypeActions();

				if (!this._moreOptionsVisible)
					jQuery("#" + this.getFormId() + " > .moreOptions").hide();
				else
					this.applyAdditionalAreaActions();

				this.updateColor(this.getColor(), 0);
				this.changeUndoBtnStates();
				this.refreshExpandButtons();
			},

			updateStatesFromForm : function() {
				/**
				 * jQuery("<div/>").text(value).html() is used to encode
				 * various html entities ;)
				 */
				this.setLink(jQuery("<div/>").text(
						jQuery("#" + this.getFormId() + "_link").attr("value"))
						.html());
				this.setLabel(jQuery("<div/>")
						.text(
								jQuery("#" + this.getFormId() + "_label").attr(
										"value")).html());
				var that = this;
				if (typeof this._attr != "object")
					return;
				jQuery.each(this._attr, function(key, val) {
					that._attr[key] = jQuery("<div/>").text(
							jQuery("#" + that.getFormId() + "_" + key).attr(
									"value")).html();
				});
			},

			getCommonFormUpdateFields : function() {
				var result = this.getFormId() + "_link=\"" + this.getLink()
						+ "\";";
				result = result + this.getFormId() + "_label=\""
						+ this.getLabel() + "\";";
				// result = result + this.getFormId() + "_color=\"" +
				// this.getColor() + "\";";
				if (typeof this._attr == "object") {
					var that = this;
					jQuery.each(this._attr, function(key, val) {
						result = result + that.getFormId() + "_" + key + "=\""
								+ val + "\";";
					});
				}
				this.updateColor(this.getColor(), false);
				return result;
			},

			getAdditionalAttributeXML : function() {
				var add = "alt=\"" + this.getLabel().replace(/"/g, "\&quot;")
						+ "\" color=\"" + this.getColor() + "\"";
				var that = this;
				if (typeof this._attr != "object")
					return;
				jQuery.each(this._attr, function(key, val) {
					add = add + " " + key + "=\""
							+ that._attr[key].replace(/"/g, "\&quot;") + "\"";
				});
				return add;
			},

			applyAdditionalAreaActions : function() {
				if (this._moreOptionsInitFlag == true)
					return;
				jQuery("#" + this.getFormId() + "_color > .colorPicker").data(
						"area", this).simpleColor( {
					colors : this._colors
				}).click(function(event, data) {
					if (typeof data == 'undefined')
						return;
					var that = jQuery(this).data("area");
					that.pushUndoableAction();
					that.updateColor(data, 1);
				});

				this.applyAdditionalTypeActions();

				this._moreOptionsInitFlag = true;
			},

			refreshExpandButtons : function() {
				jQuery("#" + this.getFormId() + " > .basicOptions > .exp > .expUpDown")
						.hide();
				if (this.isMoreOptionsVisible()) {
					jQuery(
							"#" + this.getFormId()
									+ " > .basicOptions > .exp > .up")
							.show();
				} else {
					jQuery(
							"#" + this.getFormId()
									+ " > .basicOptions > .exp > .down")
							.show();
				}
			},

			toogleMoreOptionsFlag : function() {
				this._moreOptionsVisible = !this._moreOptionsVisible;
				this.refreshExpandButtons();
			},
			isMoreOptionsVisible : function() {
				return this._moreOptionsVisible;
			},

			getId : function() {
				return this._id;
			},
			getFormId : function() {
				return this.getId();
			},

			performResizeAction : function(edge, x, y) {
				// abstract
			},

			hitOnObjectEdge : function(x, y, s) {
				return -1;
			},

			hitEdge : function(mX, mY, bX, bY, edgeSize) {
				return ((Math.abs(mX - bX) <= (edgeSize)) && (Math.abs(mY - bY) <= (edgeSize)));
			},

			performDragAction : function(border, x, y) {
				// abstract
			},

			hitOnObjectBorder : function(x, y, s) {
				return -1;
			},

			hitBorder : function(x1, y1, x2, y2, mX, mY, size) {
				var s2 = (size / 2);
				var xIn = (x1 > x2) ? ((mX <= x1 + s2) && (mX >= x2 - s2))
						: ((mX >= x1 - s2) && (mX <= x2 + s2));
				var yIn = (y1 > y2) ? ((mY <= y1 + s2) && (mY >= y2 - s2))
						: ((mY >= y1 - s2) && (mY <= y2 + s2));
				if (xIn && yIn) {
					var d = (mX * y1 + x2 * mY + x1 * y2 - x2 * y1 - mX * y2 - x1
							* mY)
							/ Math.sqrt(Math.pow(x2 - x1, 2)
									+ Math.pow(y2 - y1, 2));
					return (Math.abs(d) < (s2)) ? true : false;
				}
				return false;
			},

			edgeWasHit : function(border, x, y) {

			},

			borderWasHit : function(border, x, y) {

			},

			pushUndoableAction : function() {
				this.updateStatesFromForm();
				this._undoStack.push(this.getUndoObject());
				this._redoStack.splice(0, this._redoStack.length);
				this.changeUndoBtnStates();
			},

			performUndo : function() {
				if (this._undoStack.length) {
					var undo = this._undoStack.pop();
					this._redoStack.push(this.getUndoObject());
					this.restoreFromUndoOject(undo);
					this.getCanvas().updateForm(this.getId());
					this.getCanvas().updateCanvas(this.getId())
				}
				this.changeUndoBtnStates();
			},

			performRedo : function() {
				if (this._redoStack.length) {
					var redo = this._redoStack.pop();
					this._undoStack.push(this.getUndoObject());
					this.restoreFromUndoOject(redo);
					this.getCanvas().updateForm(this.getId());
					this.getCanvas().updateCanvas(this.getId())
				}
				this.changeUndoBtnStates();
			},

			getUndoObject : function() {
				return {};
			},

			restoreFromUndoOject : function(obj) {

			},

			changeUndoBtnStates : function() {
				jQuery("#" + this.getFormId() + "_undo").css('visibility',
						(this._undoStack.length ? 'visible' : 'hidden'));
				jQuery("#" + this.getFormId() + "_redo").css('visibility',
						(this._redoStack.length ? 'visible' : 'hidden'));
			}

		});
