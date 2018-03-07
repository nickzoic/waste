(function () {
  function parentKeyPath(kp) {
    return Ractive.joinKeys.apply(this, Ractive.splitKeypath(kp).reverse().slice(1).reverse());
  }

  // serializer for JSON ... this should really be built into the AST nodes, eg: give them
  // each a toString method which knows how to serialize themselves.  

  function enstringulate(x) {
    var r = "";
    if (x.type == 'object') {
      return '{' + x.value.map(function (y) { return y.map(enstringulate).join(':') }).join(',') + '}';
    } else if (x.type == 'array') {
      return '[' + x.value.map(enstringulate).join(',') + ']';
    } else if (x.type == 'string') {
      return JSON.stringify(x.value);
    } else { 
      return x.value;
    }
  }

  var json_ast_parser = require('./json_ast');
  var json_ast = json_ast_parser.parse(document.getElementById("root").innerText);

  var ractive = new Ractive({
    data: {
      root: json_ast,
    },
    template: "#template",
    el: "#root"
  });

  // the ** is a recursive matcher as introduced in ractive 0.9.0-edge or thereabouts.
  // currently released versions seem to be fine.

  ractive.observe('root', function (nv, ov, kp) {
    document.getElementById("debug").innerText = JSON.stringify(nv);
    document.getElementById("output").innerText = enstringulate(nv);
  });

  ractive.observe('root.**', function (nv, ov, kp) {
    console.log(nv, ov, kp);
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
      var keys = Ractive.splitKeypath(ractive.getContext(ev.target).getBindingPath());
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
