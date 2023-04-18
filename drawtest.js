autowatch = 1;
inlets = 1;
outlets = 1;

var mytext;
var myrender;
var mysketch;
var myfont;

var UNIQ = Date.now();
var MAIN_CTX = "maxGPT";
var NODE_CTX = "node" + UNIQ;
var ANIM_NODE = "anim" + UNIQ;

var textNode = new JitterObject("jit.gl.node");
var animNode = new JitterObject("jit.anim.node");

var statusText = new JitterObject("jit.gl.text")
var statusAnim = new JitterObject("jit.anim.node");

var textMtx = new JitterMatrix()

textNode.fsaa = 1;
textNode.type = "float32";
textNode.name = NODE_CTX;
textNode.adapt = 0;
textNode.drawto = MAIN_CTX

animNode.name = ANIM_NODE;
animNode.position = [0, 0, 0];

statusAnim.anim = ANIM_NODE;
statusAnim.position = [0.5, 0.75, 0];

var defaultStatusColor = [0., 1., 0., 0.]
statusText.drawto = NODE_CTX;
statusText.anim = statusAnim.name;
statusText.screenmode = 0;
statusText.cull_face = 1;
statusText.font = "Consolas"

var statusDecayTsk = new Task(statusDecay, this); // our main task
var decay = 1.0;
// defaults for arguments
var dcoeff = -0.00002; // decay coefficient
var count = 0;
var bufferCapture = []
function status(textBuf) {
	bufferCapture = textBuf
	doDraw(bufferCapture)
	statusDecayTsk.cancel(); // cancel the bounce, if it's going already
	statusDecayTsk.interval = 500;
	statusText.gl_color = defaultStatusColor;
	count = 0
	decay = 1.0
	statusDecayTsk.repeat();
}

function response(textBuf) {


}

function doDraw(textBuf) {
	textMtx = new JitterMatrix("text" + UNIQ, 1, "char", 40, textBuf.length);
	textMtx.setall([0]);
	for (var c = 0; c < textBuf.length; c++) {
		this.textMtx.setcell2d(c, 0, textBuf.charCodeAt(c));
	}
	statusText.jit_matrix(textMtx.name);
}
doDraw.local = 1;


//decay a msg over time
function statusDecay() {
	var intv = arguments.callee.task.interval
	arguments.callee.task.interval = intv + intv * 0.01
	decay = decay * Math.exp(++count * dcoeff); // increment the decay variable
	var color = statusText.gl_color
	color[0] = color[0] * decay
	color[1] = color[1] * decay
	color[2] = color[2] * decay
	statusText.gl_color = color
	doDraw(bufferCapture);
	if (statusText.gl_color[0] <= 0.01 && statusText.gl_color[1] <= 0.01 && statusText.gl_color[2] <= 0.01) {
		arguments.callee.task.cancel();
	}
}
statusDecay.local = 1; // prevent triggering the task directly from Max
// function stop(){
// 	tsk.cancel()
// }