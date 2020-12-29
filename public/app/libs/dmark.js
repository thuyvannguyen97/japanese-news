/*
 *  Draw Me A Kanji - v0.2.0
 *  A funny drawer for your Japanese writings
 *  http://drawmeakanji.com
 *
 *  Made by Matthieu Bilbille
 *  Under MIT License
 */
 ;(function () {
	// Create a safe reference to the DrawMeAKanji object for use below.
	var Dmak = function (text, options) {
		this.text = text;
		this.options = extend(Dmak.options, options);
		this.strokes = [];
		this.papers = [];
		this.pointer = 0;
		this.timeouts = [];

		if (!this.options.skipLoad) {
			var loader = new DmakLoader(this.options.uri);
			loader.load(text, function (data) {
				this.prepare(data);

				// Execute custom callback "loaded" here
				this.options.loaded(this.kanjis);

				if (this.options.autoplay) {
					this.render();
				}
			}.bind(this));
		}
	};

	// Current version.
	Dmak.VERSION = "0.2.0";

	Dmak.options = {
		uri: "http://128.199.226.39/",
		skipLoad: false,
		autoplay: true,
		height: 109,
		width: 109,
		viewBox: {
			x: 0,
			y: 0,
			w: 109,
			h: 109
		},
		step: 0.01,
		element: "draw",
		stroke: {
			animated : {
				drawing : true,
				erasing : false
			},
			order: {
				visible: false,
				attr: {
					"font-size": "8",
					"fill": "#999999"
				}
			},
			attr: {
				"active": "#BF0000",
				// may use the keyword "random" here for random color
				"stroke": "#2C2C2C",
				"stroke-width": 4,
				"stroke-linecap": "round",
				"stroke-linejoin": "round"
			}
		},
		grid: {
			show: false,
			attr: {
				"stroke": "#CCCCCC",
				"stroke-width": 0.5,
				"stroke-dasharray": "--"
			}
		},
		loaded: function () {
		},
		erased: function () {
		},
		drew: function () {
		}
	};

	Dmak.fn = Dmak.prototype = {

		/**
		 * Prepare kanjis and papers for rendering.
		 */
		prepare: function (data) {
			this.kanjis = preprocessStrokes(data);
			this.papers = giveBirthToRaphael(data.length);
			if (this.options.grid.show) {
				showGrid(this.papers);
			}
		},

		/**
		 * Clean all strokes on papers.
		 */
		erase: function (end) {
			// Cannot have two rendering process for the same draw. Keep it cool.
			if (this.timeouts.length) {
				return false;
			}

			// Don't go behind the beginning.
			if (this.pointer <= 0) {
				return false;
			}

			if (typeof end === "undefined") {
				end = 0;
			}

			do {
				this.pointer--;
				eraseStroke(this.kanjis[this.pointer]);

				// Execute custom callback "erased" here
				this.options.erased(this.pointer);
			}
			while (this.pointer > end);
		},

		/**
		 * All the magic happens here.
		 */
		render: function (end) {

			// Cannot have two rendering process for
			// the same draw. Keep it cool.
			if (this.timeouts.length) {
				return false;
			}

			if (typeof end === "undefined") {
				end = this.kanjis.length;
			} else if (end > this.kanjis.length) {
				return false;
			}

			var cb = function (that) {
					drawStroke(that.papers[that.kanjis[that.pointer].char], that.kanjis[that.pointer]);
					that.pointer++;
					that.timeouts.shift();

					// Execute custom callback "drew" here
					that.options.drew(that.pointer);
				},
				delay = 0,
				i;

			for (i = this.pointer; i < end; i++) {
				if (!Dmak.options.stroke.animated.drawing || delay <= 0) {
					cb(this);
				} else {
					this.timeouts.push(setTimeout(cb, delay, this));
				}
				delay += this.kanjis[i].duration + 100;
			}
		},

		/**
		 * Pause rendering
		 */
		pause: function () {
			for (var i = 0; i < this.timeouts.length; i++) {
				window.clearTimeout(this.timeouts[i]);
			}
			this.timeouts = [];
		},

		/**
		 * Wrap the erase function to remove the x last strokes.
		 */
		eraseLastStrokes: function (nbStrokes) {
			this.erase(this.pointer - nbStrokes);
		},

		/**
		 * Wrap the render function to render the x next strokes.
		 */
		renderNextStrokes: function (nbStrokes) {
			this.render(this.pointer + nbStrokes);
		}

	};

	// HELPERS

	/**
	 * Flattens the array of strokes ; 3D > 2D and does some preprocessing while
	 * looping through all the strokes:
	 *  - Maps to a character index
	 *  - Calculates path length
	 */
	function preprocessStrokes(data) {
		var strokes = [],
			stroke,
			length,
			i,
			j;

		for (i = 0; i < data.length; i++) {
			for (j = 0; j < data[i].paths.length; j++) {
				length = Raphael.getTotalLength(data[i].paths[j]);
				stroke = {
					"char": i,
					"length": length,
					"duration": length * Dmak.options.step * 1000,
					"path": data[i].paths[j],
					"text": data[i].texts[j],
					"object": {
						"path" : null,
						"text": null
					}
				};
				strokes.push(stroke);
			}
		}

		return strokes;
	}

	/**
	 * Init Raphael paper objects
	 */
	function giveBirthToRaphael(nbChar) {
		var papers = [],
			paper,
			i;

		for (i = 0; i < nbChar; i++) {
			paper = new Raphael(Dmak.options.element, Dmak.options.width + "px", Dmak.options.height + "px");
			paper.setViewBox(Dmak.options.viewBox.x, Dmak.options.viewBox.y, Dmak.options.viewBox.w, Dmak.options.viewBox.h);
			paper.canvas.setAttribute("class", "dmak-svg");
			papers.push(paper);
		}
		return papers.reverse();
	}

	/**
	 * Draw the background grid
	 */
	function showGrid(papers) {
		var i;

		for (i = 0; i < papers.length; i++) {
			papers[i].path("M" + (Dmak.options.viewBox.w / 2) + ",0 L" + (Dmak.options.viewBox.w / 2) + "," + Dmak.options.viewBox.h).attr(Dmak.options.grid.attr);
			papers[i].path("M0," + (Dmak.options.viewBox.h / 2) + " L" + Dmak.options.viewBox.w + "," + (Dmak.options.viewBox.h / 2)).attr(Dmak.options.grid.attr);
		}
	}

	/**
	 * Remove a single stroke ; deletion can be animated if set as so.
	 */
	function eraseStroke(stroke) {
		// In some cases the text object may be null:
		//  - Stroke order display disabled
		//  - Stroke already deleted
		if (stroke.object.text !== null) {
			stroke.object.text.remove();
		}

		if (Dmak.options.stroke.animated.erasing) {
			stroke.object.path.node.style.stroke = Dmak.options.stroke.attr.active;
			animateStroke(stroke, -1, function() {
				stroke.object.path.remove();

				// Finally properly prepare the object variable
				stroke.object = {
					"path" : null,
					"text" : null
				};
			});
		}
		else {
			//cb();
			
		}
	}

	/**
	 * Draw a single stroke ; drawing can be animated if set as so.
	 */
	function drawStroke(paper, stroke) {
		var cb = function() {

			// The stroke object may have been already erased when we reach this timeout
			if (stroke.object.path === null) {
				return;
			}

			if (Dmak.options.stroke.order.visible) {
				showStrokeOrder(paper, stroke);
			}

			/*var color = Dmak.options.stroke.attr.stroke;
			if(Dmak.options.stroke.attr.stroke === "random") {
				color = Raphael.getColor();
			}

			// Revert back to the default color.
			stroke.object.path.node.style.stroke = color;*/
			stroke.object.path.node.style.transition = stroke.object.path.node.style.WebkitTransition = "stroke 400ms ease";
		};
		
		if(Dmak.options.stroke.attr.stroke === "random") {
			var colorRandom = Raphael.getColor();
			Dmak.options.stroke.attr.active = colorRandom;
			Dmak.options.stroke.order.attr.fill = colorRandom;
			if (stroke.object.path != null) {
				stroke.object.path.node.style.stroke = colorRandom;
			}
		} 
		
		stroke.object.path = paper.path(stroke.path);
		stroke.object.path.attr(Dmak.options.stroke.attr);

		if (Dmak.options.stroke.animated.drawing) {
			animateStroke(stroke, 1, cb);
		}
		else {
			cb();
		}
	}

	/**
	 * Draw a single next to
	 */
	function showStrokeOrder(paper, stroke) {
		stroke.object.text = paper.text(stroke.text.x, stroke.text.y, stroke.text.value);
		stroke.object.text.attr(Dmak.options.stroke.order.attr);
	}

	/**
	 * Animate stroke drawing.
	 * Based on the great article wrote by Jake Archibald
	 * http://jakearchibald.com/2013/animated-line-drawing-svg/
	 */
	function animateStroke(stroke, direction, callback) {
		stroke.object.path.attr({"stroke": Dmak.options.stroke.attr.active});
		stroke.object.path.node.style.transition = stroke.object.path.node.style.WebkitTransition = "none";

		// Set up the starting positions
		stroke.object.path.node.style.strokeDasharray = stroke.length + " " + stroke.length;
		stroke.object.path.node.style.strokeDashoffset = (direction > 0) ? stroke.length : 0;

		// Trigger a layout so styles are calculated & the browser
		// picks up the starting position before animating
        try {
		  stroke.object.path.node.getBoundingClientRect();
        } catch (err) {
            console.log(err);
        }
		stroke.object.path.node.style.transition = stroke.object.path.node.style.WebkitTransition = "stroke-dashoffset " + stroke.duration + "ms ease";

		// Go!
		stroke.object.path.node.style.strokeDashoffset = (direction > 0) ? "0" : stroke.length;

		// Execute the callback once the animation is done.
		setTimeout(callback, stroke.duration);
	}

	/**
	 * Simplistic helper function for extending objects
	 */
	function extend(defaults, replacement) {
		var result = defaults,
			key;

		if (arguments.length !== 2) {
			throw new Error("Missing arguments in extend function");
		}

		for (key in replacement) {
			if (typeof result[key] === "object") {
				result[key] = extend(result[key], replacement[key]);
			} else if (result.hasOwnProperty(key)) {
				result[key] = replacement[key];
			}
		}
		return result;
	}

	window.Dmak = Dmak;
}());

;(function () {

	"use strict";

	// Create a safe reference to the DrawMeAKanji object for use below.
	var DmakLoader = function (uri) {
		this.uri = uri;
	};

	/**
	 * Gather SVG data information for a given set of characters.
	 * By default this action is done while instanciating the Word
	 * object, but it can be skipped, see above
	 */
	DmakLoader.prototype.load = function (text, callback) {
		var paths = [],
			nbChar = text.length,
			done = 0,
			i,
			callbacks = {
				done: function (index, data) {
					paths[index] = data;
					done++;
					if (done === nbChar) {
						callback(paths);
					}
				},
				error: function (msg) {
					console.log("Error", msg);
                    
                    // show message error
                    $("#image-holder").html("Không có dữ liệu nét vẽ.");
				}
			};

		for (i = 0; i < nbChar; i++) {
			loadSvg(this.uri, i, text.charCodeAt(i).toString(16), callbacks);
		}
	};

	/**
	 * Try to load a SVG file matching the given char code.
	 * @thanks to the incredible work made by KanjiVG
	 * @see: http://kanjivg.tagaini.net
	 */
	function loadSvg(uri, index, charCode, callbacks) {
		var xhr = new XMLHttpRequest(),
			code = ("00000" + charCode).slice(-5);

		// Skip space character
		if(code === "00020" || code === "03000") {
			callbacks.done(index, {
				paths: [],
				texts: []
			});
			return;
		}

		xhr.open("GET", uri + code + ".svg", true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					callbacks.done(index, parseResponse(xhr.response));
				} else {
                    if (xhr.status == 0 &&
                        xhr.responseText != '') {
                        callbacks.done(index, parseResponse(xhr.response));
                        return;
                    }
					callbacks.error(xhr.statusText);
				}
			}
		};
		xhr.send();
	}

	/**
	 * Simple parser to extract paths and texts data.
	 */
	function parseResponse(response) {
		var data = {
				paths: [],
				texts: []
			},
			dom = new DOMParser().parseFromString(response, "application/xml"),
			paths = dom.querySelectorAll("path"),
			texts = dom.querySelectorAll("text"),
			i;

		for (i = 0; i < paths.length; i++) {
			data.paths.push(paths[i].getAttribute("d"));
		}

		for (i = 0; i < texts.length; i++) {
			data.texts.push({
				"value" : texts[i].textContent,
				"x" : texts[i].getAttribute("transform").split(" ")[4],
				"y" : texts[i].getAttribute("transform").split(" ")[5].replace(")", "")
			});
		}
		return data;
	}

	window.DmakLoader = DmakLoader;
}());

/*
 *  Draw Me A Kanji - v0.2.0
 *  A funny drawer for your Japanese writings
 *  http://drawmeakanji.com
 *
 *  Made by Matthieu Bilbille
 *  Under MIT License
 */
/**
 * Draw Me a Kanji - version: 0.1
 * Plugin jQuery
 *
 * https://github.com/mbilbille/drawmeakanji
 * https://github.com/mbilbille
 *
 * Licensed under the MIT license.
 */
 ;(function ( $, window, document, undefined ) {

	// Create the defaults once
	var pluginName = "dmak";

	// The actual plugin constructor
	function Plugin ( element, text, options ) {
		this.element = element;
		this.text = text;
		this.options = $.extend( {}, options, {"element" : $(element).attr("id")} );
		this._name = pluginName;
		this.dmak = null;
		this.init();
	}

	Plugin.prototype = {
		init: function () {
			this.dmak = new Dmak(this.text, this.options);
		},
		reset: function() {
			this.dmak.erase();
		},
		pause: function() {
			this.dmak.pause();
		},
		play: function() {
			this.dmak.render();
		},
		rewind: function (x) {
			this.dmak.eraseLastStrokes(x);
		},
		forward: function (x) {
			this.dmak.renderNextStrokes(x);
		},
		rewindTo: function (t) {
			this.dmak.erase(t);
		},
		forwardTo: function (t) {
			this.dmak.render(t);
		}
	};

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[ pluginName ] = function ( text, options ) {
		return this.each(function() {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
				$.data( this, "plugin_" + pluginName, new Plugin( this, text, options ) );
			}
			else if ($.isFunction(Plugin.prototype[text])) {
				$.data(this, "plugin_" + pluginName)[text](options);
			}
		});
	};

})( jQuery, window, document );
