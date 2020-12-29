
function KanjiWriter(initParam) {
    this.param = initParam;
    
    this.canvas = document.getElementById(this.param.canvasId);
    this.colorDraw = this.param.colorDraw;
    this.lineWidthDraw = this.param.lineWidthDraw;
    this.ctx = this.canvas.getContext("2d");
    
    if (window.devicePixelRatio) {
        this.canvas.width = $("#" + this.param.canvasId).parent().width() * window.devicePixelRatio;
        this.canvas.height = $("#" + this.param.canvasId).height() * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    } else {
        this.canvas.width = $("#" + this.param.canvasId).parent().width();
        this.canvas.height = $("#" + this.param.canvasId).height();
    }
    
    
    this.drawWidth = this.canvas.width;
    this.drawHeight = this.canvas.height;
    
    this.flag = false;
    this.points = [];
    this.currentLineSig = null;
    this.inks = [];
    this.startDrawTime = 0;
    this.currentDrawTime = 0;
    
    if (!isMobileDevice()) {
        this.canvas.addEventListener("mousemove", this.mousemove.bind(this), false);
        this.canvas.addEventListener("mousedown", this.mousedown.bind(this), false);
        this.canvas.addEventListener("mouseup", this.mouseup.bind(this), false);
    } else {
        this.canvas.addEventListener("touchstart", this.touchstart.bind(this), false);
        this.canvas.addEventListener("touchmove", this.touchmove.bind(this), false);
        this.canvas.addEventListener("touchend", this.touchend.bind(this), false);
    }
    
    this.ctx.strokeStyle = this.colorDraw;
    this.ctx.lineWidth = this.lineWidthDraw;
    this.ctx.lineJoin = this.ctx.lineCap = 'round';
    this.ctx.shadowBlur = this.lineWidthDraw / 2;
    this.ctx.shadowColor = this.colorDraw;
    
    this.getOffsetCanvas();
    $(this.param.clearButtonId).click(function() {
        this.clear();
    }.bind(this));
    
    $(this.param.backButtonId).click(function() {
        this.back();
    }.bind(this));
}

KanjiWriter.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.drawWidth, this.drawHeight);
    
    this.resetInk();
    this.startDrawTime = 0;
    $(this.param.resultId).html("");
}

KanjiWriter.prototype.updateLayout = function() {
    
    if (window.devicePixelRatio) {
        this.canvas.width = $("#" + this.param.canvasId).parent().width() * window.devicePixelRatio;
        this.canvas.height = $("#" + this.param.canvasId).height() * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    } else {
        this.canvas.width = $("#" + this.param.canvasId).parent().width();
        this.canvas.height = $("#" + this.param.canvasId).height();
    }
    
    this.drawWidth = this.canvas.width;
    this.drawHeight = this.canvas.height;
    
    this.ctx.strokeStyle = this.colorDraw;
    this.ctx.lineWidth = this.lineWidthDraw;
    this.ctx.lineJoin = this.ctx.lineCap = 'round';
    this.ctx.shadowBlur = this.lineWidthDraw / 2;
    this.ctx.shadowColor = this.colorDraw;
    
    this.getOffsetCanvas();
};

KanjiWriter.prototype.getOffsetCanvas = function() {
    var relativePosCanvas = this.findPos(this.canvas);
    if (relativePosCanvas == undefined) {
        relativePosCanvas = new Object();
        relativePosCanvas.x = 0;
        relativePosCanvas.y = 0;
    }
    
    this.relativePos = relativePosCanvas;
};

KanjiWriter.prototype.mousemove = function(e) {
    this.findxy("move", e);
};

KanjiWriter.prototype.mousedown = function(e) {
    this.findxy("down", e);
};

KanjiWriter.prototype.mouseup = function(e) {
    this.findxy("up", e);
};

KanjiWriter.prototype.touchstart = function(e) {
    this.findxy("touchstart", e);
};

KanjiWriter.prototype.touchmove = function(e) {
    this.findxy("touchmove", e);
};

KanjiWriter.prototype.touchend = function(e) {
    this.findxy("touchend", e);
};

KanjiWriter.prototype.draw = function() {
    
    var p1 = this.points[0];
    var p2 = this.points[1];
    
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    
    for (var i = 1, len = this.points.length; i < len; i++) {
        var midPoint = this.midPointBtw(p1, p2);
        this.ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
        p1 = this.points[i];
        p2 = this.points[i+1];
    }
    
    this.ctx.lineTo(p1.x, p1.y);
    this.ctx.stroke();
}

KanjiWriter.prototype.back = function() {
    if (this.inks.length == 0) {
        return;
    }
    
    // remove last stroke in inks
    this.inks.pop();
    
    // redraw and request result
    this.reDraw();
    this.requestGoogleInput();
}

KanjiWriter.prototype.reDraw = function() {
    
    // clear draw table
    this.ctx.clearRect(0, 0, this.drawWidth, this.drawHeight);
    
    if (this.inks.length == 0) {
        return;
    }
    
    for (var i = 0; i < this.inks.length; i++) {
        this.points = [];
        for (var j = 0; j < this.inks[i][0].length; j++) {
            this.points.push({ x: this.inks[i][0][j], y: this.inks[i][1][j] });
            if (this.points.length > 1) {
                this.draw();
            }
        }
    }
    
    this.points = [];
}

KanjiWriter.prototype.findxy = function(res, e) {
    
    var clientX = 0, clientY = 0;
    if (res.indexOf('touch') != -1) {
        var touchobj = e.changedTouches[0];
        clientX = touchobj.clientX;
        clientY = touchobj.clientY;
        e.preventDefault();
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    
    var canoffset = $(this.canvas).offset();
    if (res == 'down' || 
       res == 'touchstart') {
        currX = clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left);
        currY = clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1;

        this.points.push({ x: currX, y: currY });
        this.currentLineSig = [];
        this.currentLineSig[0] = [];
        this.currentLineSig[1] = [];
        this.currentLineSig[2] = [];
        
        this.currentLineSig[0].push(currX);
        this.currentLineSig[1].push(currY);
        
        if (this.startDrawTime == 0) {
            this.startDrawTime = (new Date()).getTime();
            this.currentLineSig[2].push(0);
        } else {
            this.currentDrawTime = (new Date()).getTime();
            this.currentLineSig[2].push(this.currentDrawTime - this.startDrawTime);
        }
        
        
        this.flag = true;
        //this.ctx.fillRect(currX, currY, this.lineWidthDraw, this.lineWidthDraw);
    }
    if (res == 'up' ||
       res == 'touchend') {
        this.flag = false;
        this.points = [];
        this.inks[this.inks.length] = this.currentLineSig;
        this.requestGoogleInput();
    }
    if (res == 'move' ||
       res == 'touchmove') {
        if (this.flag) {
            currX = clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left);
            currY = clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1;
            this.points.push({ x: currX, y: currY });
            
            this.currentDrawTime = (new Date()).getTime();
            
            this.currentLineSig[0].push(currX);
            this.currentLineSig[1].push(currY);
            this.currentLineSig[2].push(this.currentDrawTime - this.startDrawTime);
            
            this.draw();
        }
    }
}

KanjiWriter.prototype.midPointBtw = function(p1, p2) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2
  };
}

KanjiWriter.prototype.resetInk = function() {
    this.inks = [];;
}

KanjiWriter.prototype.findPos = function(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

KanjiWriter.prototype.requestGoogleInput = function() {
    var rqUrl = "https://inputtools.google.com/request?itc=ja-t-i0-handwrit&app=translate";
    var dataRq = new Object();
    
    dataRq.api_level = "537.36";
    dataRq.app_version = 0.4;
    dataRq.device = "5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36";
    dataRq.input_type = 0;
    dataRq.options = "enable_pre_space";
    var requests = new Object();
    requests.max_completions = 0;
    requests.max_num_results = 10;
    requests.pre_context = "";
    requests.writing_guide = new Object();
    requests.writing_guide.writing_area_height = this.drawHeight;
    requests.writing_guide.writing_area_width = this.drawWidth;
    requests.ink = this.inks;
    
    dataRq.requests = [];
    dataRq.requests[0] = requests;
    
    $.ajax({
        type	: 'POST',
        url	: rqUrl,
        contentType : "application/json; charset=UTF-8",
        data	: JSON.stringify(dataRq),
        dataType : 'json',
        success : function(data, status, xhr) {
            this.printResult(data);
        }.bind(this),
        error	: function(xhr, status, xhr) {
           $(this.param.resultId).html("<p class='handwriter-no-network'>Tính năng này cần kết nối mạng!</p>");
        }.bind(this)
    });
}

KanjiWriter.prototype.printResult = function(result) {
    // clear old result
    $(this.param.resultId).html("");
    
    if (typeof result === 'undefined' ||
        result[0] !== 'SUCCESS') {
        return;
    }
    
    var kanjis = result[1][0][1];
    
    if (kanjis == null || 
        kanjis.length == 0) {
        return;
    }
    
    var markup = '';
    for (var i = 0; i < kanjis.length; i++) {
        markup += ('<span class="' + this.param.classResult + '">' + kanjis[i] + '</span>');
    }
    
    $(this.param.resultId).html(markup);
    
    if (this.param.resultClickCallback != null) {
        $("." + this.param.classResult).click(this.param.resultClickCallback);
    }
}


function isMobileDevice() {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        return true;
    }

    return false;
}