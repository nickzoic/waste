var ractive = require("ractive");
var json_ast_parser = require("./json_ast.js");

var obj = json_ast_parser.parse('{"this": "is", "a": [ "json", "parsing", "test" ], "atoms": [ true, false, null ], "numbers": [ 0, 0E0, 12902340239420349032472834723847283478234, 0.00000000000000000000000000000000000001 ] }');

console.log(JSON.stringify(obj, null, 2));
