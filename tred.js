(function () {
  function parentKeyPath(kp) {
    return Ractive.joinKeys.apply(this, Ractive.splitKeypath(kp).reverse().slice(1).reverse());
  }

  var example = {
    "title": "example JSON document",
    "array": [ "this", "is", "an", "array" ],
    "object": { "objects": "look", "like": "this", "and": [ "they", "can", "nest" ] },
    "number": 42,
    "not a number": "42",
    "special stuff": [ true, false, null ]
  };

  var ractive = new Ractive({
    data: {
      root: example,
      debug: ""
    },
    template: "#template",
    el: document.body
  });

  // the ** is a recursive matcher as introduced in ractive 0.9.0-edge or thereabouts.
 
  ractive.observe('root', function (nv, ov, kp) {
    ractive.set('debug', JSON.stringify(nv));
  });

  ractive.observe('root.**', function (nv, ov, kp) {
    if (!nv) {
      var keys = Ractive.splitKeypath(kp);
      var childNumber = 1 * keys.pop();
      var parentKeyPath = Ractive.joinKeys.apply(this, keys);
      ractive.splice(parentKeyPath, childNumber, 1);
    }
  });

  document.onkeydown = function (ev) {
    if (ev.code !== 'Escape') return true;
    console.log(ev);
  };

  document.onkeypress = function (ev) {
    if (ev.code !== 'Enter' && ev.code !== 'Space') return true;
    if (ev.shiftKey) return true;

    setTimeout(function () {
      var focusNode = window.getSelection().focusNode;
      var focusOffset = window.getSelection().focusOffset;
      var target = ev.target;
      var before = '', after = '';
      for (var i=0; i<target.childNodes.length; i++) {
        var childNode = target.childNodes[i];
        if (focusNode === childNode) {
          before = after + childNode.textContent.substr(0, focusOffset);
          after = childNode.textContent.substr(focusOffset);
        } else {
          after += childNode.textContent;
        }
      }
      console.log(focusOffset+"["+before+"|"+after+"]");
      var keys = Ractive.splitKeypath(Ractive.getNodeInfo(ev.srcElement).getBindingPath());
      var childNumber = 1 * keys.pop();
      var parentKeyPath = Ractive.joinKeys.apply(this, keys);
      ractive.splice(parentKeyPath, childNumber, 1, before, after);
    }, 0);
    return false;
  };
    /*if ((ev.code === 'Enter' || ev.code === 'Space') && !ev.shiftKey) 
    console.log(ev);
    var info = Ractive.getNodeInfo(ev.srcElement);
    var kp = info.getBindingPath();
    console.log("!!!" + kp);*/

})();
