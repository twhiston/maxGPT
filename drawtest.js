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
var glText = new JitterObject("jit.gl.text");
var text =  new JitterObject("jit.gl.text")
var animNode = new JitterObject("jit.anim.node");
var textAnim = new JitterObject("jit.anim.node");
var textMtx = new JitterMatrix()
	
textNode.fsaa = 1;
textNode.type = "float32";
textNode.name = NODE_CTX;
textNode.adapt = 0;
	
animNode.name = ANIM_NODE;
animNode.position = [0, 0, 0];

textAnim.anim = ANIM_NODE;
textAnim.position = [0.5, 0, 0];

textNode.drawto = MAIN_CTX
	
text.drawto = NODE_CTX;
text.anim = textAnim.name;
text.gl_color = [1, 0, 0, 1];
text.screenmode = 0;
text.cull_face = 1;
text.font = "Arial"

function drawText(textBuf) {
        textMtx = new JitterMatrix("text" + UNIQ, 1, "char", 40, textBuf.length);
        textMtx.setall([0]);
		for (var c = 0; c < textBuf.length; c++) {
        	this.textMtx.setcell2d(c, 0, textBuf.charCodeAt(c));
        }
	    text.jit_matrix(textMtx.name);
}

//TODO: DECAY alpha with timer https://docs.cycling74.com/max8/tutorials/javascriptchapter03
