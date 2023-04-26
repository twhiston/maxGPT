autowatch = 1;
inlets = 1;
outlets = 1;

function TextElement(ANIM_NODE, NODE_CTX) {
	this.textObject = new JitterObject("jit.gl.text")
	this.textAnim = new JitterObject("jit.anim.node");
	this.textMtx = new JitterMatrix()

	this.UNIQ = Date.now();
	this.bufferCapture = []
	this.defaultStatusColor = [0.262, 0.262, 0.262, 0.]

	this.textAnim.anim = ANIM_NODE;
	this.textAnim.position = [0.5, 0.75, 0];
	this.textAnim.scale = [2, 2, 0];

	this.textObject.drawto = NODE_CTX;
	this.textObject.anim = this.textAnim.name;
	this.textObject.screenmode = 0;
	this.textObject.cull_face = 1;
	this.textObject.font = "Consolas"

	this.draw = function (textBuf) {
		this.bufferCapture = textBuf
		this.textObject.gl_color = this.defaultStatusColor
		this.doDraw()
	}

	this.doDraw = function () {
		this.textMtx = new JitterMatrix("text" + this.UNIQ, 1, "char", 80, 40);
		this.textMtx.setall([0]);
		var chunks = this.bufferCapture.match(/.{1,80}(?:\s|$)/g);
		chunks = (chunks === null) ? [this.bufferCapture] : chunks;
		for (var l = 0; l < chunks.length; l++) {
			for (var c = 0; c < chunks[l].length; c++) {
				this.textMtx.setcell2d(c, l, chunks[l].charCodeAt(c));
			}
		}
		this.textObject.jit_matrix(this.textMtx.name);
	}

	this.free = function () {
		this.textObject.freepeer()
		this.textAnim.freepeer()
	}
}

//Setup the global objects
var UNIQ = Date.now();
var MAIN_CTX = "maxGPT";
var NODE_CTX = "node" + UNIQ;
var ANIM_NODE = "anim" + UNIQ;

var textNode = new JitterObject("jit.gl.node");
textNode.fsaa = 1;
textNode.type = "float32";
textNode.name = NODE_CTX;
textNode.adapt = 0;
textNode.drawto = MAIN_CTX

var animNode = new JitterObject("jit.anim.node");
animNode.name = ANIM_NODE;
animNode.position = [0, 0, 0];

//Make the text elements

//Status element has a task attached to it to make the text vanish over time as some indicator
// that something is happening while we wait forever for the results
var statusElement = new TextElement(ANIM_NODE, NODE_CTX);
statusElement.decay = 1.0
statusElement.dcoeff = -0.0002; // decay coefficient
statusElement.count = 0;

statusElement.resetDecay = function () {
	this.decay = 1.0
	this.count = 0
	this.dcoeff = -0.0002;
	this.textObject.gl_color = this.defaultStatusColor;
}

statusElement.doDecay = function () {
	this.decay = this.decay * Math.exp(++this.count * this.dcoeff); // increment the decay variable
	var color = this.textObject.gl_color
	color[0] = color[0] * this.decay
	color[1] = color[1] * this.decay
	color[2] = color[2] * this.decay
	this.textObject.gl_color = color
	this.doDraw();
}

statusElement.fadedOut = function () {
	return (this.textObject.gl_color[0] <= 0.01 && this.textObject.gl_color[1] <= 0.01 && this.textObject.gl_color[2] <= 0.01)
}

//decay a msg over time
function statusDecay() {
	var intv = arguments.callee.task.interval
	arguments.callee.task.interval = intv + intv * 0.001
	statusElement.doDecay()
	if (statusElement.fadedOut()) {
		statusElement.resetDecay()
		//arguments.callee.task.cancel();
	}
}
statusDecay.local = 1; // prevent triggering the task directly from Max
var statusDecayTsk = new Task(statusDecay, this); // our status task

function status(textBuf) {
	statusElement.draw(textBuf);
	responseElement.draw("");
	//Setup the task
	statusDecayTsk.cancel();
	statusDecayTsk.interval = 500;
	statusElement.resetDecay()
	statusDecayTsk.repeat();
}

var responseElement = new TextElement(ANIM_NODE, NODE_CTX);
responseElement.textAnim.position = [-1.4, 0.2, 0];
responseElement.textAnim.scale = [1.5, 1.5, 0];
responseElement.defaultStatusColor = [0.795, 0.795, 0.795, 1.]
function response(textBuf) {
	statusDecayTsk.cancel();
	statusElement.draw("");
	responseElement.draw(textBuf)
}

function freebang() {
	statusElement.free()
	responseElement.free()
}
