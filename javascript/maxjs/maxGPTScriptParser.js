inlets = 1
outlets = 2

function path() {
  var pp = this.patcher.parentpatcher
  var path = ""
  if (pp)
    path = pp.filepath
  if (path === "")
    path = this.patcher.filepath
  outlet(1, beforeLast(path, "/"))
}

function json(filePath) {

  var p = this.patcher
  if (this.patcher.parentpatcher)
    p = this.patcher.parentpatcher

  var bpatcherPosition = [50, 50]; // Set the position where you want the [bpatcher] object to be created
  var bpatcherSize = [300, 300]; // Set the size of the [bpatcher] object

  var jsObject = p.newdefault(20, 40, "\"" + filePath + "\"");
  jsObject.front();

}

function code(filePath) {
  var p = this.patcher
  if (this.patcher.parentpatcher) {
    p = this.patcher.parentpatcher
  }
  var timestamp = new Date().getTime();
  var subpatcherName = "subpatcher_" + timestamp;
  var subpatcherBox = p.newdefault(0, 0, "p", subpatcherName);
  var subpatcher = subpatcherBox.subpatcher();

  var jsObject = subpatcher.newdefault(20, 40, "js", filePath);
  var bangObject = subpatcher.newdefault(20, 10, "button");

  subpatcher.connect(bangObject, 0, jsObject, 0);

}


function beforeLast(value, delimiter) {
  value = value || ''

  if (delimiter === '') {
    return value
  }

  const substrings = value.split(delimiter)

  return substrings.length === 1
    ? value // delimiter is not part of the string
    : substrings.slice(0, -1).join(delimiter)
}
beforeLast.local = 1;