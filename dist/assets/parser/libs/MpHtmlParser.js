'use strict';

/**
 * html 解析器
 * @tutorial https://github.com/jin-yufeng/Parser
 * @version 20200615
 * @author JinYufeng
 * @listens MIT
 */
var cfg = require('./config.js'),
    blankChar = cfg.blankChar,
    CssHandler = require('./CssHandler.js'),
    windowWidth = wx.getSystemInfoSync().windowWidth;
var emoji;

function MpHtmlParser(data) {
  var _this = this;

  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  this.attrs = {};
  this.CssHandler = new CssHandler(options.tagStyle, windowWidth);
  this.data = data;
  this.domain = options.domain;
  this.DOM = [];
  this.i = this.start = this.audioNum = this.imgNum = this.videoNum = 0;
  options.prot = (this.domain || '').includes('://') ? this.domain.split('://')[0] : 'http';
  this.options = options;
  this.state = this.Text;
  this.STACK = [];
  // 工具函数
  this.bubble = function () {
    for (var i = _this.STACK.length, item; item = _this.STACK[--i];) {
      if (cfg.richOnlyTags[item.name]) {
        if (item.name == 'table' && !Object.hasOwnProperty.call(item, 'c')) item.c = 1;
        return false;
      }
      item.c = 1;
    }
    return true;
  };
  this.decode = function (val, amp) {
    var i = -1,
        j,
        en;
    while (1) {
      if ((i = val.indexOf('&', i + 1)) == -1) break;
      if ((j = val.indexOf(';', i + 2)) == -1) break;
      if (val[i + 1] == '#') {
        en = parseInt((val[i + 2] == 'x' ? '0' : '') + val.substring(i + 2, j));
        if (!isNaN(en)) val = val.substr(0, i) + String.fromCharCode(en) + val.substr(j + 1);
      } else {
        en = val.substring(i + 1, j);
        if (cfg.entities[en] || en == amp) val = val.substr(0, i) + (cfg.entities[en] || '&') + val.substr(j + 1);
      }
    }
    return val;
  };
  this.getUrl = function (url) {
    if (url[0] == '/') {
      if (url[1] == '/') url = _this.options.prot + ':' + url;else if (_this.domain) url = _this.domain + url;
    } else if (_this.domain && url.indexOf('data:') != 0 && !url.includes('://')) url = _this.domain + '/' + url;
    return url;
  };
  this.isClose = function () {
    return _this.data[_this.i] == '>' || _this.data[_this.i] == '/' && _this.data[_this.i + 1] == '>';
  };
  this.section = function () {
    return _this.data.substring(_this.start, _this.i);
  };
  this.parent = function () {
    return _this.STACK[_this.STACK.length - 1];
  };
  this.siblings = function () {
    return _this.STACK.length ? _this.parent().children : _this.DOM;
  };
}
MpHtmlParser.prototype.parse = function () {
  if (emoji) this.data = emoji.parseEmoji(this.data);
  for (var c; c = this.data[this.i]; this.i++) {
    this.state(c);
  }if (this.state == this.Text) this.setText();
  while (this.STACK.length) {
    this.popNode(this.STACK.pop());
  }return this.DOM;
};
// 设置属性
MpHtmlParser.prototype.setAttr = function () {
  var name = this.attrName.toLowerCase(),
      val = this.attrVal;
  if (cfg.boolAttrs[name]) this.attrs[name] = 'T';else if (val) {
    if (name == 'src' || name == 'data-src' && !this.attrs.src) this.attrs.src = this.getUrl(this.decode(val, 'amp'));else if (name == 'href' || name == 'style') this.attrs[name] = this.decode(val, 'amp');else if (name.substr(0, 5) != 'data-') this.attrs[name] = val;
  }
  this.attrVal = '';
  while (blankChar[this.data[this.i]]) {
    this.i++;
  }if (this.isClose()) this.setNode();else {
    this.start = this.i;
    this.state = this.AttrName;
  }
};
// 设置文本节点
MpHtmlParser.prototype.setText = function () {
  var back,
      text = this.section();
  if (!text) return;
  text = cfg.onText && cfg.onText(text, function () {
    return back = true;
  }) || text;
  if (back) {
    this.data = this.data.substr(0, this.start) + text + this.data.substr(this.i);
    var j = this.start + text.length;
    for (this.i = this.start; this.i < j; this.i++) {
      this.state(this.data[this.i]);
    }return;
  }
  if (!this.pre) {
    // 合并空白符
    var tmp = [];
    for (var i = text.length, c; c = text[--i];) {
      if (!blankChar[c] || !blankChar[tmp[0]] && (c = ' ')) tmp.unshift(c);
    }text = tmp.join('');
  }
  this.siblings().push({
    type: 'text',
    text: this.decode(text)
  });
};
// 设置元素节点
MpHtmlParser.prototype.setNode = function () {
  var node = {
    name: this.tagName.toLowerCase(),
    attrs: this.attrs
  },
      close = cfg.selfClosingTags[node.name];
  this.attrs = {};
  if (!cfg.ignoreTags[node.name]) {
    // 处理属性
    var attrs = node.attrs,
        style = this.CssHandler.match(node.name, attrs, node) + (attrs.style || ''),
        styleObj = {};
    if (attrs.id) {
      if (this.options.compress & 1) attrs.id = undefined;else if (this.options.useAnchor) this.bubble();
    }
    if (this.options.compress & 2 && attrs.class) attrs.class = undefined;
    switch (node.name) {
      case 'a':
      case 'ad':
        this.bubble();
        break;
      case 'font':
        if (attrs.color) {
          styleObj['color'] = attrs.color;
          attrs.color = undefined;
        }
        if (attrs.face) {
          styleObj['font-family'] = attrs.face;
          attrs.face = undefined;
        }
        if (attrs.size) {
          var size = parseInt(attrs.size);
          if (size < 1) size = 1;else if (size > 7) size = 7;
          var map = ['xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large'];
          styleObj['font-size'] = map[size - 1];
          attrs.size = undefined;
        }
        break;
      case 'embed':
        var src = node.attrs.src || '',
            type = node.attrs.type || '';
        if (type.includes('video') || src.includes('.mp4') || src.includes('.3gp') || src.includes('.m3u8')) node.name = 'video';else if (type.includes('audio') || src.includes('.m4a') || src.includes('.wav') || src.includes('.mp3') || src.includes('.aac')) node.name = 'audio';else break;
        if (node.attrs.autostart) node.attrs.autoplay = 'T';
        node.attrs.controls = 'T';
      // falls through
      case 'video':
      case 'audio':
        if (!attrs.id) attrs.id = node.name + ++this[node.name + 'Num'];else this[node.name + 'Num']++;
        if (node.name == 'video') {
          if (this.videoNum > 3) node.lazyLoad = 1;
          if (attrs.width) {
            styleObj.width = parseFloat(attrs.width) + (attrs.width.includes('%') ? '%' : 'px');
            attrs.width = undefined;
          }
          if (attrs.height) {
            styleObj.height = parseFloat(attrs.height) + (attrs.height.includes('%') ? '%' : 'px');
            attrs.height = undefined;
          }
        }
        attrs.source = [];
        if (attrs.src) {
          attrs.source.push(attrs.src);
          attrs.src = undefined;
        }
        this.bubble();
        break;
      case 'td':
      case 'th':
        if (attrs.colspan || attrs.rowspan) for (var k = this.STACK.length, item; item = this.STACK[--k];) {
          if (item.name == 'table') {
            item.c = undefined;
            break;
          }
        }}
    if (attrs.align) {
      styleObj['text-align'] = attrs.align;
      attrs.align = undefined;
    }
    // 压缩 style
    var styles = style.split(';');
    style = '';
    for (var i = 0, len = styles.length; i < len; i++) {
      var info = styles[i].split(':');
      if (info.length < 2) continue;
      var _key = info[0].trim().toLowerCase(),
          _value = info.slice(1).join(':').trim();
      if (_value.includes('-webkit') || _value.includes('-moz') || _value.includes('-ms') || _value.includes('-o') || _value.includes('safe')) style += ';' + _key + ':' + _value;else if (!styleObj[_key] || _value.includes('import') || !styleObj[_key].includes('import')) styleObj[_key] = _value;
    }
    if (node.name == 'img') {
      if (attrs.src && !attrs.ignore) {
        if (this.bubble()) attrs.i = (this.imgNum++).toString();else attrs.ignore = 'T';
      }
      if (attrs.ignore) {
        style += ';-webkit-touch-callout:none';
        styleObj['max-width'] = '100%';
      }
      var width;
      if (styleObj.width) width = styleObj.width;else if (attrs.width) width = attrs.width.includes('%') ? attrs.width : attrs.width + 'px';
      if (width) {
        styleObj.width = width;
        attrs.width = '100%';
        if (parseInt(width) > windowWidth) {
          styleObj.height = '';
          if (attrs.height) attrs.height = undefined;
        }
      }
      if (styleObj.height) {
        attrs.height = styleObj.height;
        styleObj.height = '';
      } else if (attrs.height && !attrs.height.includes('%')) attrs.height += 'px';
    }
    for (var key in styleObj) {
      var value = styleObj[key];
      if (!value) continue;
      if (key.includes('flex') || key == 'order' || key == 'self-align') node.c = 1;
      // 填充链接
      if (value.includes('url')) {
        var j = value.indexOf('(');
        if (j++ != -1) {
          while (value[j] == '"' || value[j] == "'" || blankChar[value[j]]) {
            j++;
          }value = value.substr(0, j) + this.getUrl(value.substr(j));
        }
      }
      // 转换 rpx
      else if (value.includes('rpx')) value = value.replace(/[0-9.]+\s*rpx/g, function ($) {
          return parseFloat($) * windowWidth / 750 + 'px';
        });else if (key == 'white-space' && value.includes('pre')) this.pre = node.pre = true;
      style += ';' + key + ':' + value;
    }
    style = style.substr(1);
    if (style) attrs.style = style;
    if (!close) {
      node.children = [];
      if (node.name == 'pre' && cfg.highlight) {
        this.remove(node);
        this.pre = node.pre = true;
      }
      this.siblings().push(node);
      this.STACK.push(node);
    } else if (!cfg.filter || cfg.filter(node, this) != false) this.siblings().push(node);
  } else {
    if (!close) this.remove(node);else if (node.name == 'source') {
      var parent = this.parent();
      if (parent && (parent.name == 'video' || parent.name == 'audio') && node.attrs.src) parent.attrs.source.push(node.attrs.src);
    } else if (node.name == 'base' && !this.domain) this.domain = node.attrs.href;
  }
  if (this.data[this.i] == '/') this.i++;
  this.start = this.i + 1;
  this.state = this.Text;
};
// 移除标签
MpHtmlParser.prototype.remove = function (node) {
  var _this2 = this;

  var name = node.name,
      j = this.i;
  // 处理 svg
  var handleSvg = function handleSvg() {
    var src = _this2.data.substring(j, _this2.i + 1);
    if (!node.attrs.xmlns) src = ' xmlns="http://www.w3.org/2000/svg"' + src;
    var i = j;
    while (_this2.data[j] != '<') {
      j--;
    }src = _this2.data.substring(j, i) + src;
    var parent = _this2.parent();
    if (node.attrs.width == '100%' && parent && (parent.attrs.style || '').includes('inline')) parent.attrs.style = 'width:300px;max-width:100%;' + parent.attrs.style;
    _this2.siblings().push({
      name: 'img',
      attrs: {
        src: 'data:image/svg+xml;utf8,' + src.replace(/#/g, '%23'),
        style: (/vertical[^;]+/.exec(node.attrs.style) || []).shift(),
        ignore: 'T'
      }
    });
  };
  if (node.name == 'svg' && this.data[j] == '/') return handleSvg(this.i++);
  while (1) {
    if ((this.i = this.data.indexOf('</', this.i + 1)) == -1) {
      if (name == 'pre' || name == 'svg') this.i = j;else this.i = this.data.length;
      return;
    }
    this.start = this.i += 2;
    while (!blankChar[this.data[this.i]] && !this.isClose()) {
      this.i++;
    }if (this.section().toLowerCase() == name) {
      // 代码块高亮
      if (name == 'pre') {
        this.data = this.data.substr(0, j + 1) + cfg.highlight(this.data.substring(j + 1, this.i - 5), node.attrs) + this.data.substr(this.i - 5);
        return this.i = j;
      } else if (name == 'style') this.CssHandler.getStyle(this.data.substring(j + 1, this.i - 7));else if (name == 'title') this.DOM.title = this.data.substring(j + 1, this.i - 7);
      if ((this.i = this.data.indexOf('>', this.i)) == -1) this.i = this.data.length;
      if (name == 'svg') handleSvg();
      return;
    }
  }
};
// 节点出栈处理
MpHtmlParser.prototype.popNode = function (node) {
  // 空白符处理
  if (node.pre) {
    node.pre = this.pre = undefined;
    for (var i = this.STACK.length; i--;) {
      if (this.STACK[i].pre) this.pre = true;
    }
  }
  var siblings = this.siblings(),
      len = siblings.length,
      childs = node.children;
  if (node.name == 'head' || cfg.filter && cfg.filter(node, this) == false) return siblings.pop();
  var attrs = node.attrs;
  // 替换一些标签名
  if (cfg.blockTags[node.name]) node.name = 'div';else if (!cfg.trustTags[node.name]) node.name = 'span';
  // 去除块标签前后空串
  if (node.name == 'div' || node.name == 'p' || node.name[0] == 't') {
    if (len > 1 && siblings[len - 2].text == ' ') siblings.splice(--len - 1, 1);
    if (childs.length && childs[childs.length - 1].text == ' ') childs.pop();
  }
  // 处理列表
  if (node.c && (node.name == 'ul' || node.name == 'ol')) {
    if ((node.attrs.style || '').includes('list-style:none')) {
      for (var _i = 0, child; child = childs[_i++];) {
        if (child.name == 'li') child.name = 'div';
      }
    } else if (node.name == 'ul') {
      var floor = 1;
      for (var _i2 = this.STACK.length; _i2--;) {
        if (this.STACK[_i2].name == 'ul') floor++;
      }if (floor != 1) for (var _i3 = childs.length; _i3--;) {
        childs[_i3].floor = floor;
      }
    } else {
      for (var _i4 = 0, num = 1, _child; _child = childs[_i4++];) {
        if (_child.name == 'li') {
          _child.type = 'ol';
          _child.num = function (num, type) {
            if (type == 'a') return String.fromCharCode(97 + (num - 1) % 26);
            if (type == 'A') return String.fromCharCode(65 + (num - 1) % 26);
            if (type == 'i' || type == 'I') {
              num = (num - 1) % 99 + 1;
              var one = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'],
                  ten = ['X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'],
                  res = (ten[Math.floor(num / 10) - 1] || '') + (one[num % 10 - 1] || '');
              if (type == 'i') return res.toLowerCase();
              return res;
            }
            return num;
          }(num++, attrs.type) + '.';
        }
      }
    }
  }
  // 处理表格的边框
  if (node.name == 'table') {
    var padding = attrs.cellpadding,
        spacing = attrs.cellspacing,
        border = attrs.border;
    if (node.c) {
      this.bubble();
      attrs.style = (attrs.style || '') + ';display:table';
      if (!padding) padding = 2;
      if (!spacing) spacing = 2;
    }
    if (border) attrs.style = 'border:' + border + 'px solid gray;' + (attrs.style || '');
    if (spacing) attrs.style = 'border-spacing:' + spacing + 'px;' + (attrs.style || '');
    if (border || padding || node.c) (function f(ns) {
      for (var i = 0, n; n = ns[i]; i++) {
        if (n.type == 'text') continue;
        var style = n.attrs.style || '';
        if (node.c && n.name[0] == 't') {
          n.c = 1;
          style += ';display:table-' + (n.name == 'th' || n.name == 'td' ? 'cell' : n.name == 'tr' ? 'row' : 'row-group');
        }
        if (n.name == 'th' || n.name == 'td') {
          if (border) style = 'border:' + border + 'px solid gray;' + style;
          if (padding) style = 'padding:' + padding + 'px;' + style;
        } else f(n.children || []);
        if (style) n.attrs.style = style;
      }
    })(childs);
    if (this.options.autoscroll) {
      var table = Object.assign({}, node);
      node.name = 'div';
      node.attrs = {
        style: 'overflow:scroll'
      };
      node.children = [table];
    }
  }
  this.CssHandler.pop && this.CssHandler.pop(node);
  // 自动压缩
  if (node.name == 'div' && !Object.keys(attrs).length && childs.length == 1 && childs[0].name == 'div') siblings[len - 1] = childs[0];
};
// 状态机
MpHtmlParser.prototype.Text = function (c) {
  if (c == '<') {
    var next = this.data[this.i + 1],
        isLetter = function isLetter(c) {
      return c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z';
    };
    if (isLetter(next)) {
      this.setText();
      this.start = this.i + 1;
      this.state = this.TagName;
    } else if (next == '/') {
      this.setText();
      if (isLetter(this.data[++this.i + 1])) {
        this.start = this.i + 1;
        this.state = this.EndTag;
      } else this.Comment();
    } else if (next == '!') {
      this.setText();
      this.Comment();
    }
  }
};
MpHtmlParser.prototype.Comment = function () {
  var key;
  if (this.data.substring(this.i + 2, this.i + 4) == '--') key = '-->';else if (this.data.substring(this.i + 2, this.i + 9) == '[CDATA[') key = ']]>';else key = '>';
  if ((this.i = this.data.indexOf(key, this.i + 2)) == -1) this.i = this.data.length;else this.i += key.length - 1;
  this.start = this.i + 1;
  this.state = this.Text;
};
MpHtmlParser.prototype.TagName = function (c) {
  if (blankChar[c]) {
    this.tagName = this.section();
    while (blankChar[this.data[this.i]]) {
      this.i++;
    }if (this.isClose()) this.setNode();else {
      this.start = this.i;
      this.state = this.AttrName;
    }
  } else if (this.isClose()) {
    this.tagName = this.section();
    this.setNode();
  }
};
MpHtmlParser.prototype.AttrName = function (c) {
  if (c == '=' || blankChar[c] || this.isClose()) {
    this.attrName = this.section();
    if (blankChar[c]) while (blankChar[this.data[++this.i]]) {}
    if (this.data[this.i] == '=') {
      while (blankChar[this.data[++this.i]]) {}
      this.start = this.i--;
      this.state = this.AttrValue;
    } else this.setAttr();
  }
};
MpHtmlParser.prototype.AttrValue = function (c) {
  if (c == '"' || c == "'") {
    this.start++;
    if ((this.i = this.data.indexOf(c, this.i + 1)) == -1) return this.i = this.data.length;
    this.attrVal = this.section();
    this.i++;
  } else {
    for (; !blankChar[this.data[this.i]] && !this.isClose(); this.i++) {}
    this.attrVal = this.section();
  }
  this.setAttr();
};
MpHtmlParser.prototype.EndTag = function (c) {
  if (blankChar[c] || c == '>' || c == '/') {
    var name = this.section().toLowerCase();
    for (var i = this.STACK.length; i--;) {
      if (this.STACK[i].name == name) break;
    }if (i != -1) {
      var node;
      while ((node = this.STACK.pop()).name != name) {
        this.popNode(node);
      }this.popNode(node);
    } else if (name == 'p' || name == 'br') this.siblings().push({
      name: name,
      attrs: {}
    });
    this.i = this.data.indexOf('>', this.i);
    this.start = this.i + 1;
    if (this.i == -1) this.i = this.data.length;else this.state = this.Text;
  }
};
module.exports = MpHtmlParser;