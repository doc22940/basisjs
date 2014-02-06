module.exports = {
  name: 'basis.dom',

  html: __dirname + 'dom.html',
  init: function(){
    basis.require('basis.dom');

    var DOM = basis.dom;
    var pg = DOM.get('playground');

    function resolveNodes(nodes){
      var result = [];
      if (!nodes)
        nodes = [];
      else
        if (nodes.constructor != Array)
          nodes = [nodes];
      for (var i = 0; i < nodes.length; i++)
        result.push(nodes[i].id || nodes[i].nodeValue);
      return result.join(' ');
    }

    var a1 = 'n1 n2 1 n3 2 n4 n5 3 n6 4 n7 5 n8 n9 6 7 8 n10 9';
    var a2 = '1 2 3 4 5 6 7 8 9';
    var a3 = 'n1 n2 n3 n4 n5 n6 n7 n8 n9 n10';
    var a4 = 'n1 n10 9 n3 8 n4 n7 7 n8 n9 6 5 n6 4 n5 3 2 n2 1';

    var IS_TEXT_NODE = function(node){
      return node.nodeType == 3;
    };
    var IS_ELEMENT_NODE = function(node){
      return node.nodeType == 1;
    };
  },

  test: [
    {
      name: 'TreeWalker',
      test: [
        {
          name: 'create',
          test: function(){
            var w = new DOM.TreeWalker(pg);
            this.is(a1, resolveNodes(w.nodes()));
            w.setDirection(DOM.TreeWalker.BACKWARD);
            this.is(a4, resolveNodes(w.nodes()));

            var w = new DOM.TreeWalker(pg, IS_TEXT_NODE);
            this.is(a2, resolveNodes(w.nodes()));
            this.is(a1, resolveNodes(w.nodes(basis.fn.$true)));
            w.next();
            w.next();
            this.is(a2, resolveNodes(w.nodes()));

            var w = new DOM.TreeWalker(pg);
            this.is(a2, resolveNodes(w.nodes(IS_TEXT_NODE)));
            this.is(a1, resolveNodes(w.nodes()));

            this.is(a3, resolveNodes(new DOM.TreeWalker(pg, IS_ELEMENT_NODE).nodes()));

            this.is(a4, resolveNodes(new DOM.TreeWalker(pg, null, DOM.TreeWalker.BACKWARD).nodes()));
          }
        },
        {
          name: 'next/prev',
          test: function(){
            var w = new DOM.TreeWalker(pg);
            var r1 = [];
            var r2 = [];
            var node;
            while (node = w.next())
              r1.push(node);
            while (node = w.prev())
              r2.push(node);

            this.is(resolveNodes(r1), resolveNodes(r2.reverse()));
          }
        },
        {
          name: 'next',
          test: function(){
            var w = new DOM.TreeWalker(pg);
            this.is('n1', resolveNodes(w.next()));
            this.is('n2', resolveNodes(w.next()));
            this.is(DOM.get('n2'), w.cursor_);
            w.reset();
            this.is(null, w.cursor_);
            this.is('1', resolveNodes(w.next(IS_TEXT_NODE)));
            this.is(true, w.filter != IS_TEXT_NODE);
            this.is('2', resolveNodes(w.next(IS_TEXT_NODE)));
          }
        },
        {
          name: 'next backward',
          test: function(){
            var w = new DOM.TreeWalker(pg, null, DOM.TreeWalker.BACKWARD);
            this.is('n1', resolveNodes(w.next()));
            this.is('n10', resolveNodes(w.next()));
            this.is(DOM.get('n10'), w.cursor_);
            w.reset();
            this.is(null, w.cursor_);
            this.is('9', resolveNodes(w.next(IS_TEXT_NODE)));
            this.is(true, w.filter != IS_TEXT_NODE);
            this.is('8', resolveNodes(w.next(IS_TEXT_NODE)));
          }
        },
        {
          name: 'prev',
          test: function(){
            var w = new DOM.TreeWalker(pg);
            this.is('9', resolveNodes(w.prev()));
            this.is('n10', resolveNodes(w.prev()));
            this.is(DOM.get('n10'), w.cursor_);
            w.reset();
            this.is(null, w.cursor_);
            this.is('9', resolveNodes(w.prev(IS_TEXT_NODE)));
            this.is(true, w.filter != IS_TEXT_NODE);
            this.is('8', resolveNodes(w.prev(IS_TEXT_NODE)));
          }
        },
        {
          name: 'prev backward',
          test: function(){
            var w = new DOM.TreeWalker(pg, null, DOM.TreeWalker.BACKWARD);
            this.is('1', resolveNodes(w.prev()));
            this.is('n2', resolveNodes(w.prev()));
            this.is(DOM.get('n2'), w.cursor_);
            w.reset();
            this.is(null, w.cursor_);
            this.is('1', resolveNodes(w.prev(IS_TEXT_NODE)));
            this.is(true, w.filter != IS_TEXT_NODE);
            this.is('2', resolveNodes(w.prev(IS_TEXT_NODE)));
          }
        },
        {
          name: 'first',
          test: function(){
            var w = new DOM.TreeWalker(pg);
            this.is('n1', resolveNodes(w.first()));
            this.is(DOM.get('n1'), w.cursor_);
            w.next();
            this.is(true, DOM.get('n1') !== w.cursor_);
            this.is('n1', resolveNodes(w.first()));

            w.reset();
            this.is(null, w.cursor_);
            this.is('1', resolveNodes(w.first(IS_TEXT_NODE)));
            this.is(true, w.filter != IS_TEXT_NODE);
            w.next();
            this.is('1', resolveNodes(w.first(IS_TEXT_NODE)));
          }
        },
        {
          name: 'first backward',
          test: function(){
            var w = new DOM.TreeWalker(pg, null, DOM.TreeWalker.BACKWARD);
            this.is('n1', resolveNodes(w.first()));
            this.is(DOM.get('n1'), w.cursor_);
            w.next();
            this.is(true, DOM.get('n1') !== w.cursor_);
            this.is('n1', resolveNodes(w.first()));

            w.reset();
            this.is(null, w.cursor_);
            this.is('9', resolveNodes(w.first(IS_TEXT_NODE)));
            this.is(true, w.filter != IS_TEXT_NODE);
            w.next();
            this.is('9', resolveNodes(w.first(IS_TEXT_NODE)));
          }
        },
        {
          name: 'last',
          test: function(){
            var w = new DOM.TreeWalker(pg);
            var el;
            this.is('9', resolveNodes(el = w.last()));
            this.is(el, w.cursor_);
            w.next();
            this.is(true, el !== w.cursor_);
            this.is('9', resolveNodes(w.last()));

            w.reset();
            this.is(null, w.cursor_);
            this.is('n10', resolveNodes(w.last(IS_ELEMENT_NODE)));
            this.is(true, w.filter != IS_ELEMENT_NODE);
            w.next();
            this.is('n10', resolveNodes(w.last(IS_ELEMENT_NODE)));
          }
        },
        {
          name: 'last backward',
          test: function(){
            var w = new DOM.TreeWalker(pg, null, DOM.TreeWalker.BACKWARD);
            var el;
            this.is('1', resolveNodes(el = w.last()));
            this.is(el, w.cursor_);
            w.next();
            this.is(true, el !== w.cursor_);
            this.is('1', resolveNodes(w.last()));

            w.reset();
            this.is(null, w.cursor_);
            this.is('n2', resolveNodes(w.last(IS_ELEMENT_NODE)));
            this.is(true, w.filter != IS_ELEMENT_NODE);
            w.next();
            this.is('n2', resolveNodes(w.last(IS_ELEMENT_NODE)));
          }
        }
      ]
    },
    {
      name: 'axis',
      test: [
        {
          name: 'AXIS_ANCESTOR/AXIS_ANCESTOR_OR_SELF',
          test: function(){
            var root = DOM.get('n6');
            var node = root.parentNode;
            var r1 = [];
            while (node && node != root.document)
            {
              r1.push(node);
              node = node.parentNode;
            }

            this.is(r1, DOM.axis(root, DOM.AXIS_ANCESTOR));
            this.is([document.body], DOM.axis(root, DOM.AXIS_ANCESTOR, function(node){ return node.tagName == 'BODY'; }));

            r1.unshift(root);
            this.is(r1, DOM.axis(root, DOM.AXIS_ANCESTOR_OR_SELF));
            this.is([document.body], DOM.axis(root, DOM.AXIS_ANCESTOR_OR_SELF, function(node){ return node.tagName == 'BODY'; }));
          }
        },
        {
          name: 'AXIS_CHILD',
          test: function(){
            var root = DOM.get('n1');
            var node = root.firstChild;
            var r1 = [];
            while (node)
            {
              r1.push(node);
              node = node.nextSibling;
            }

            this.is(r1, DOM.axis(root, DOM.AXIS_CHILD));
            this.is(['n2', 'n3', 'n10'].map(DOM.get), DOM.axis(root, DOM.AXIS_CHILD, function(node){ return node.tagName == 'LI'; }));

            var root = DOM.get('n3');
            var node = root.firstChild;
            var r1 = [];
            while (node)
            {
              r1.push(node);
              node = node.nextSibling;
            }
            this.is(r1, DOM.axis(root, DOM.AXIS_CHILD));
            this.is(r1.filter(IS_TEXT_NODE), DOM.axis(root, DOM.AXIS_CHILD, IS_TEXT_NODE));
          }
        }
      ]
    }
  ]
};
