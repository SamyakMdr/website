(function(){
var KasperskyLab = {SIGNATURE:"7D8B79A2-8974-4D7B-A76A-F4F29624C06BcezDqGU52scqUVtGZvOszhd0VWPyNSxYu5OY3FjXQQ-rcm8d9J8FOh45O0bzGUXQDxWmPPwq8XY_3oobyWZKKw",PLUGINS_LIST:"",PREFIX:"https://gc.kis.v2.scr.kaspersky-labs.com/",INJECT_ID:"FD126C42-EBFA-4E12-B309-BB3FDD723AC1"}; var KasperskyLab = (function (context) {
    function GetClass(obj) {
        if (typeof obj === "undefined")
            return "undefined";
        if (obj === null)
            return "null";
        return Object.prototype.toString.call(obj)
            .match(/^\[object\s(.*)\]$/)[1];
    }
    var exports = {}, undef;
    function ObjectToJson(object) {
        if (object === null || object == Infinity || object == -Infinity || object === undef)
            return "null";
        var className = GetClass(object);
        if (className == "Boolean") {
            return "" + object;
        } else if (className == "Number") {
            return window.isNaN(object) ? "null" : "" + object;
        } else if (className == "String") {
			var escapedStr = "" + object;
            return "\"" + escapedStr.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"") + "\"";
        }
        if (typeof object == "object") {
            if (!ObjectToJson.check) ObjectToJson.check = [];
            for (var i=0, chkLen=ObjectToJson.check.length ; i<chkLen ; ++i) {
                if (ObjectToJson.check[i] === object) {
                    throw new TypeError();
                }
            }
            ObjectToJson.check.push(object);
            var str = '';
            if (className == "Array" || className == "Array Iterator") {
                for (var index = 0, length = object.length; index < length; ++index) {
                    str += ObjectToJson(object[index]) + ',';
                }
                ObjectToJson.check.pop();
                return "["+str.slice(0,-1)+"]";
            } else {
                for (var property in object) {
                    if (object.hasOwnProperty(property)) {
                        str += '"' + property + '":' + ObjectToJson(object[property]) + ',';
                    }
                }
                ObjectToJson.check.pop();
                return "{"+str.slice(0,-1)+"}";
            }
        }
        return undef;
    }
    exports.stringify = function (source) {
        return ObjectToJson(source);
    };
    var parser = {
        source : null,
        grammar : /^[\x20\t\n\r]*(?:([,:\[\]{}]|true|false|null)|(-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)|"((?:[^\r\n\t\\\"]|\\(?:["\\\/trnfb]|u[0-9a-fA-F]{4}))*)")/,
        ThrowError : function() {
            throw new SyntaxError('JSON syntax error');
        },
        NextToken : function(token) {
            this.source = token.input.slice(token[0].length);
            return this.grammar.exec(this.source);
        },
        ParseArray : function(){
            var token = this.grammar.exec(this.source),
                parseItem = token && token[1] != ']',
                result = [];
            for(;;token = this.NextToken(token)) {
                if (!token)
                    this.ThrowError();
                if (parseItem) {
                    result.push(this.ParseValue(token));
                    token = this.grammar.exec(this.source);
                } else {
                    if (token[1]) {
                        if (token[1] == ']') {
                            break;
                        } else if (token[1] != ',') {
                            this.ThrowError();
                        }
                    } else {
                        this.ThrowError();
                    }
                }
                parseItem = !parseItem;
            }
            return result;
        },
        ParseObject : function(){
            var propertyName, parseProperty = true, result = {};
            for(var token = this.grammar.exec(this.source);;token = this.NextToken(token)) {
                if (!token)
                    this.ThrowError();
                if (parseProperty) {
                    if (token[1] && token[1] == '}') {
                        break;
                    } else if (token[1] || token[2] || !token[3]) {
                        this.ThrowError();
                    }
                    propertyName = token[3];
                    token = this.NextToken(token);
                    if (!token || !token[1] || token[1] != ':')
                        this.ThrowError();
                    parseProperty = false;
                } else {
                    if (!propertyName)
                        this.ThrowError();
                    result[ propertyName ] = this.ParseValue(token);
                    token = this.NextToken(this.grammar.exec(this.source));
                    if (token[1]) {
                        if (token[1] == '}') {
                            break;
                        } else if (token[1] != ',') {
                            this.ThrowError();
                        }
                    } else {
                        this.ThrowError();
                    }
                    propertyName = undef;
                    parseProperty = true;
                }
            }
            return result;
        },
        ParseValue : function(token){
            if (token[1]) {
                switch (token[1]){
                    case '[' :
                        this.source = this.source.slice(token[0].length);
                        return this.ParseArray();
                    case '{' :
                        this.source = this.source.slice(token[0].length);
                        return this.ParseObject();
                    case 'true' :
                        return true;
                    case 'false' :
                        return false;
                    case 'null' :
                        return null;
                    default:
                        this.ThrowError();
                }
            } else if (token[2]) {
                return  +token[2];
            }
            return token[3].replace(/\\(?:u(.{4})|(["\\\/'bfnrt]))/g, function(substr, utfCode, esc){
                if(utfCode)
                {
                    return String.fromCharCode(parseInt(utfCode, 16));
                }
                else
                {
                    switch(esc) {
                        case 'b': return '\b';
                        case 'f': return '\f';
                        case 'n': return '\n';
                        case 'r': return '\r';
                        case 't': return '\t';
                        default:
                            return esc;
                    }
                }
            });
        },
        Parse : function(str) {
            if ('String' != GetClass(str))
                throw new TypeError();
            this.source = str;
            var token = this.grammar.exec(this.source);
            if (!token)
                this.ThrowError();
            return this.ParseValue(token);
        }
    };
    exports.parse = function (source) {
        return parser.Parse(source);
    };
    context['JSONStringify'] = exports.stringify;
    context['JSONParse'] = exports.parse;
    return context;
}).call(this, KasperskyLab || {});
 var KasperskyLab = (function ( ns) {
	ns.MaxRequestDelay = 2000;
	ns.Log = function()
	{};
	ns.SessionLog = function()
	{};
	ns.GetDomainName = function() 
	{
	    return document.location.hostname;
	}
	var originalWindowOpen = window.open;
	ns.WindowOpen = function(url)
	{
		if (typeof(originalWindowOpen) === "function")
			originalWindowOpen.call(window, url);
		else
			originalWindowOpen(url);	
	}
	ns.EncodeURI = encodeURI;
	ns.GetResourceSrc = function () {};
	ns.IsRelativeTransport = function()
	{
		return ns.PREFIX == "/";
	}
	ns.AddEventListener = function(element, name, func)
	{
		if ("addEventListener" in element)
			element.addEventListener(name, 
				function(e) 
				{
					try
					{
						func(e || window.event);
					}
					catch (e)
					{
						ns.SessionLog(e);
					}
				}, true);
		else
			element.attachEvent("on" + name, 
				function(e)
				{
					try
					{
						func.call(element, e || window.event);
					}
					catch (e)
					{
						ns.SessionLog(e);
					}
				});
	};
	ns.AddRemovableEventListener = function ( element,  name,  func) {
		if (element.addEventListener)
			element.addEventListener(name, func, true);
		else
			element.attachEvent('on' + name, func);
	};
	ns.RunModule = function(func, timeout)
	{
		if (document.readyState === "loading")
		{
			if (timeout)
				ns.SetTimeout(func, timeout);
			if (document.addEventListener)
				ns.AddEventListener(document, "DOMContentLoaded", func);
			else
				ns.AddEventListener(document, "load", func);
		}
		else
		{
			func();
		}
	};
	ns.RemoveEventListener = function ( element,  name, func) {
		if (element.removeEventListener)
			element.removeEventListener(name, func, true);
		else
			element.detachEvent('on' + name, func);
	};
	ns.SetTimeout = function(func, timeout)
	{
		return setTimeout(
			function()
			{
				try
				{
					func();
				}
				catch (e)
				{
					ns.SessionLog(e);
				}
			}, timeout);
	}
	ns.SetInterval = function(func, interval)
	{
		return setInterval(
			function()
			{
				try
				{
					func();
				}
				catch (e)
				{
					ns.SessionLog(e);
				}
			}, interval);
	}
	function InsertStyleRule( style,  rule) {
		if (style.styleSheet)
		{
			style.styleSheet.cssText += rule + '\n';
		}
		else
		{
			style.appendChild(document.createTextNode(rule));
			ns.SetTimeout(
				function()
				{
					if (!style.sheet)
						return;
					var rules = style.sheet.cssRules || style.sheet.rules;
					if (rules && rules.length === 0)
						style.sheet.insertRule(rule);
				}, 500);
		}
	}
	ns.AddStyles = function (rules)
	{
		return ns.AddDocumentStyles(document, rules);
	}
	ns.AddDocumentStyles = function(document, rules)
	{
		if (typeof rules !== 'object' || rules.constructor !== Array) {
			return;
		}
        var styles = [];
		for (var i = 0, len = rules.length; i < len; )
		{
		    var style = document.createElement('style');
            style.type = 'text/css';
            style.setAttribute('nonce', ns.ContentSecurityPolicyNonceAttribute);
            for (var n = 0; n < 4 && i < len; ++n, ++i)
            {
                var rule = rules[i];
                if (document.querySelectorAll)
                {
                    InsertStyleRule(style, rule);
                }
                else
                {
                    var styleBegin = rule.lastIndexOf('{');
                    if (styleBegin == -1)
                        continue;
                    var styleText = rule.substr(styleBegin);
                    var selectors = rule.substr(0, styleBegin).split(',');
                    if (style.styleSheet)
                    {
                        var cssText = '';
                        for (var j = 0; j != selectors.length; ++j)
                            cssText += selectors[j] + styleText + '\n';
                        style.styleSheet.cssText += cssText;
                    }
                    else
                    {
                        for (var j = 0; j != selectors.length; ++j)
                            style.appendChild(document.createTextNode(selectors[j] + styleText));
                    }
                }
            }
            if (document.head)
                document.head.appendChild(style);
            else
                document.getElementsByTagName('head')[0].appendChild(style);
            styles.push(style);
		}
        return styles;
	};
	ns.AddCssLink = function(document, href, loadCallback, errorCallback)
	{
		var link = document.createElement("link");
		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = href;
		if (loadCallback)
		{
			ns.AddEventListener(link, "load", function()
				{
					try
					{
						link && link.sheet && link.sheet.cssText;	
						loadCallback();
					}
					catch(e)
					{
						if (errorCallback)
							errorCallback();
					}
				});
		}
		if (errorCallback)
		{
			ns.AddEventListener(link, "error",
				function()
				{
					errorCallback();
					ns.SessionLog("failed load resource: " + href);
				});
		}
		if (document.head)
			document.head.appendChild(link);
		else
			document.getElementsByTagName("head")[0].appendChild(link);
	}
	ns.GetCurrentTime = function () {
		return new Date().getTime();
	};
	ns.GetPageScroll = function()
	{
		return {
				left: (document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft,
				top: (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop
			};
	};
	ns.GetPageHeight = function()
	{
		return document.documentElement.clientHeight || document.body.clientHeight;
	};
	ns.GetPageWidth = function()
	{
		return document.documentElement.clientWidth || document.body.clientWidth;
	};
	ns.IsDefined = function (variable)
	{
		return "undefined" !== typeof(variable);
	};
	ns.StopProcessingEvent = function(evt)
	{
		if (evt.preventDefault)
			evt.preventDefault();
		else
			evt.returnValue = false;
		if (evt.stopPropagation)
			evt.stopPropagation();
		if (ns.IsDefined(evt.cancelBubble))
			evt.cancelBubble = true;
	}
	ns.AddIframeDoctype = function(element)
	{
		var frameDocument = element.contentDocument || element.contentWindow.document;
		if (document.implementation && document.implementation.createDocumentType)
		{
			var newDoctype = document.implementation.createDocumentType('html', '', '');
			if (frameDocument.childNodes.length)
				frameDocument.insertBefore(newDoctype, frameDocument.childNodes[0]);
			else
				frameDocument.appendChild(newDoctype);
		}
		else
		{
			frameDocument.write("<!DOCTYPE html>");
			frameDocument.close();
		}
	}
	function IsGoogleSearch(linkElement)
    {
        var parentTagName = linkElement.parentNode.tagName.toLowerCase();
        if (parentTagName === "div")
        {
            if (linkElement.className)
                return false;
        }
        else if (parentTagName !== "h3")
        {
            return false;
        }
        return linkElement.parentNode.className.toLowerCase() === "r";
	}
	function IsYandexSearch(linkElement)
	{
		if (linkElement.parentNode.tagName.toLowerCase() === "h2" && (
				linkElement.className.toLowerCase().indexOf("serp-item__title-link") !== -1 ||
				linkElement.className.toLowerCase().indexOf("b-serp-item__title-link") !== -1 ||
				linkElement.className.toLowerCase().indexOf("organic__url") !== -1))
		    return true;
        else
		    return false;
	}
	function IsYahooSearch(linkElement)
	{
		if (linkElement.className.toLowerCase().indexOf("ac-21th") !== -1)
			return true;
		return false;
	}
	function IsYahooLocalSearch(linkElement)
	{
		return IsYahooSearch(linkElement) || linkElement.className.toLowerCase().indexOf("td-u") !== -1;
	}
	function IsYahooCoSearch(linkElement)
	{
		if (linkElement.parentNode.tagName.toLowerCase() === "h3" &&
			linkElement.parentNode.parentNode &&
			linkElement.parentNode.parentNode.className.toLowerCase() === "hd")
			return true;
		return false;
	}
	function IsBingSearch(linkElement)
	{
		if (linkElement.parentNode.tagName.toLowerCase() !== "h2" || !linkElement.parentNode.parentNode)
			return false;
		if (linkElement.parentNode.parentNode.className.toLowerCase().indexOf("sb_tlst") !== -1 ||
			linkElement.parentNode.parentNode.className.toLowerCase().indexOf("b_algo") !== -1)
			return true;
		if (linkElement.parentNode.parentNode.parentNode &&
			linkElement.parentNode.parentNode.className.toLowerCase().indexOf("b_title") !== -1 &&
			linkElement.parentNode.parentNode.parentNode.className.toLowerCase().indexOf("b_algo") !== -1)
			return true;
		return false;
	}
	function IsMailRuSearch(linkElement)
	{
		if (linkElement.target.toLowerCase() === "_blank" && (
			linkElement.parentNode.className.toLowerCase() === "res-head" ||
			linkElement.parentNode.className.toLowerCase() === "result__title"))
			return true;
		return false;
	}
	function IsRamblerRuSearch(linkElement)
	{
		if (linkElement.className.toLowerCase() === "b-serp-item__link")
			return true;
		return false;
	}
	function IsBaiduComSearch(linkElement)
	{
		if (linkElement.parentNode.className.toLowerCase() === "t")
			return true;
		return false;
	}
	function IsBaiduJpSearch(linkElement)
	{
		if (linkElement.parentNode.tagName.toLowerCase() === "h3" &&
			linkElement.parentNode.parentNode &&
			linkElement.parentNode.parentNode.parentNode &&
			linkElement.parentNode.parentNode.parentNode.className.toLowerCase() === "web")
			return true;
		return false;
	}
	function IsAskComSearch(linkElement)
	{
		if (linkElement.className.toLowerCase() === "partialsearchresults-item-title-link result-link")
			return true;
		return false;
	}
	function NotSearchSite()
	{
		return false;
	}
	function DecodeURI(query)
	{
		return decodeURIComponent(query.replace(/\+/g, ' '));
	}
	function GetSearchRequest(parameterName, decodeUriFunc)
	{
		var parameters = document.location.href.split(/[?#&]/);
		var result = "";
		for (var i = 0; i < parameters.length; ++i) 
		{
			var parameter = parameters[i];
			var parameterSeparatorPos = parameter.indexOf("=");
			if (parameterSeparatorPos == -1)
				continue;
			if (parameter.substr(0, parameterSeparatorPos) != parameterName)
				continue;
			if (decodeUriFunc)
				result = decodeUriFunc(parameter.substr(parameterSeparatorPos + 1));
			else
				result = DecodeURI(parameter.substr(parameterSeparatorPos + 1));
		}
		return result;
	}
	function NotSearchSiteRequest()
	{
		return "";
	}
	function GetGeneralSearchSiteRequest()
	{
		return GetSearchRequest('q');
	}
	function GetYahooSearchSiteRequest()
	{
		return GetSearchRequest('p');
	}
	function GetYandexSearchSiteRequest()
	{
		return GetSearchRequest('text');
	}
	function GetRamblerSearchSiteRequest()
	{
		return GetSearchRequest('query');
	}
	function GetBaiduSearchSiteRequest()
	{
		return GetSearchRequest('wd');
	}
	function GetGoogleTypedSearchRequest()
	{
		var t = document.getElementById('lst-ib');
		if (t && t.tagName.toLowerCase() == "input")
			return t.value;
		else
			return ns.GetSearchSiteRequest();
	}
	try
	{
		var currentPageUrl = document.location.href;
		var schemeEndPos = currentPageUrl.indexOf("://");
		var linkFilterFunction;
		var getSearchSiteRequest;
		var getTypedRequest = null;
		if (schemeEndPos !== -1)
		{
			var host = currentPageUrl.substr(schemeEndPos + 3).toLowerCase();
			if (host.indexOf("www.google.") === 0)
			{
				linkFilterFunction = IsGoogleSearch;
				getSearchSiteRequest = GetGeneralSearchSiteRequest;
				getTypedRequest =  GetGoogleTypedSearchRequest;
			}
			else if (host.indexOf("yandex.") === 0 || host.indexOf("www.yandex.") === 0)
			{
				linkFilterFunction = IsYandexSearch;
				getSearchSiteRequest = GetYandexSearchSiteRequest;
			}
			else if (host.indexOf("search.yahoo.com") === 0)
			{
				linkFilterFunction = IsYahooSearch;
				getSearchSiteRequest = GetYahooSearchSiteRequest;
			}
			else if (host.indexOf("search.yahoo.co.") === 0)
			{
				linkFilterFunction = IsYahooCoSearch;
				getSearchSiteRequest = GetYahooSearchSiteRequest;
			}
			else if (host.indexOf("search.yahoo.com") !== -1)
			{
				linkFilterFunction = IsYahooLocalSearch;
				getSearchSiteRequest = GetYahooSearchSiteRequest;
			}
			else if (host.indexOf("www.bing.com") === 0)
			{
				linkFilterFunction = IsBingSearch;
				getSearchSiteRequest = GetGeneralSearchSiteRequest;
			}
			else if (host.indexOf("go.mail.ru") === 0)
			{
				linkFilterFunction = IsMailRuSearch;
				getSearchSiteRequest = GetGeneralSearchSiteRequest;
			}
			else if (host.indexOf("nova.rambler.ru") === 0)
			{
				linkFilterFunction = IsRamblerRuSearch;
				getSearchSiteRequest = GetRamblerSearchSiteRequest;
			}
			else if (host.indexOf("www.baidu.com") === 0)
			{
				linkFilterFunction = IsBaiduComSearch;
				getSearchSiteRequest = GetBaiduSearchSiteRequest;
			}
			else if (host.indexOf("www.baidu.jp") === 0)
			{
				linkFilterFunction = IsBaiduJpSearch;
				getSearchSiteRequest = GetBaiduSearchSiteRequest;
			}
			else if (host.indexOf("www.ask.com") === 0)
			{
				linkFilterFunction = IsAskComSearch;
				getSearchSiteRequest = GetGeneralSearchSiteRequest;
			}
			else
			{
				linkFilterFunction = NotSearchSite;
				getSearchSiteRequest = NotSearchSiteRequest;
			}			
		}
		ns.IsLinkSearchResult = linkFilterFunction;
		ns.GetSearchSiteRequest = getSearchSiteRequest;
		ns.GetTypedSearchRequest = getTypedRequest ? getTypedRequest : getSearchSiteRequest;
	}
	catch(e)
	{
		ns.IsLinkSearchResult = NotSearchSite;
		ns.GetSearchSiteRequest = NotSearchSiteRequest;
		ns.GetTypedSearchRequest = NotSearchSiteRequest;
	}
	function IsElementNode(node)
	{
		return node.nodeType === 1; 
	}
	function IsNodeContainsElementWithTag(node, observeTag)
	{
		return observeTag == "*" || (IsElementNode(node) && (node.tagName.toLowerCase() === observeTag || node.getElementsByTagName(observeTag).length > 0));
	}
	function MutationChangeObserver(observeTag)
	{
		var m_observer;
		var m_callback;
		var m_functionCheckInteresting = observeTag ? function(node){return IsNodeContainsElementWithTag(node, observeTag);} : IsElementNode;
		function ProcessNodeList(nodeList)
		{
			for (var i = 0; i < nodeList.length; ++i)
			{
				if (m_functionCheckInteresting(nodeList[i]))
					return true;
			}
			return false;
		}
		function ProcessDomChange(records)
		{
			if (!m_callback)
				return;
			for (var i = 0; i < records.length; ++i)
			{
				var record = records[i];
				if ((record.addedNodes.length && ProcessNodeList(record.addedNodes)) ||
					(record.removedNodes.length && ProcessNodeList(record.removedNodes)))
				{
					m_callback();
					return;
				}
			}
		}
		this.Start = function(callback)
		{
			m_callback = callback;
			m_observer = new MutationObserver(ProcessDomChange);
			m_observer.observe(document, { childList: true, subtree: true });
		};
		this.Stop = function()
		{
			m_observer.disconnect();
			m_callback = null;
		};
	}
	function DomEventsChangeObserver(observeTag)
	{
		var m_callback;
		var m_functionCheckInteresting = observeTag ? function(node){return IsNodeContainsElementWithTag(node, observeTag);} : IsElementNode;
		function ProcessEvent(event)
		{
			if (!m_callback)
				return;
			if (m_functionCheckInteresting(event.target))
				m_callback();
		}
		this.Start = function(callback)
		{
			ns.AddRemovableEventListener(window, "DOMNodeInserted", ProcessEvent);
			ns.AddRemovableEventListener(window, "DOMNodeRemoved", ProcessEvent);
			m_callback = callback;
		}
		this.Stop = function()
		{
			ns.RemoveEventListener(window, "DOMNodeInserted", ProcessEvent);
			ns.RemoveEventListener(window, "DOMNodeRemoved", ProcessEvent);
			m_callback = null;
		}
	}
	function TimeoutChangeObserver(observeTag)
	{
		var m_interval;
		var m_callback;
		var m_tagCount;
		var m_attribute = 'klot_' + ns.GetCurrentTime();
		function IsChangesOccure(nodeList)
		{
			for (var i = 0; i < nodeList.length; ++i)
				if (!nodeList[i][m_attribute])
					return true;
			return false;
		}
		function FillTagInfo(nodeList)
		{
			m_tagCount = nodeList.length;
			for (var i = 0; i < m_tagCount; ++i)
				nodeList[i][m_attribute] = true;
		}
		function TimeoutProcess()
		{
			if (!m_callback)
				return;
			var nodeList = observeTag ? document.getElementsByTagName(observeTag) : document.getElementsByTagName("*");
			if (nodeList.length !== m_tagCount || IsChangesOccure(nodeList))
			{
				FillTagInfo(nodeList);
				m_callback();
			}
		}
		this.Start = function(callback)
		{
			m_callback = callback;
			FillTagInfo(document.getElementsByTagName(observeTag));
			m_interval = ns.SetInterval(TimeoutProcess, 10 * 1000);
			if (document.readyState !== "complete")
				ns.AddEventListener(window, "load", TimeoutProcess);
		}
		this.Stop = function()
		{
			clearInterval(m_interval);
			m_callback = null;
		}
	}
	ns.GetDomChangeObserver = function(observeTag)
	{
		var observeTagLowerCase = observeTag ? observeTag.toLowerCase() : observeTag;
		if (window.MutationObserver && document.documentMode !== 11)	
			return new MutationChangeObserver(observeTagLowerCase);
		if (window.addEventListener)
			return new DomEventsChangeObserver(observeTagLowerCase);
		return new TimeoutChangeObserver(observeTagLowerCase);
	}
	ns.StartLocationHref = document.location.href;
	return ns;
}) (KasperskyLab || {});
(function (ns) {
	function md5cycle(x, k) {
		var a = x[0],
		b = x[1],
		c = x[2],
		d = x[3];
		a = ff(a, b, c, d, k[0], 7, -680876936);
		d = ff(d, a, b, c, k[1], 12, -389564586);
		c = ff(c, d, a, b, k[2], 17, 606105819);
		b = ff(b, c, d, a, k[3], 22, -1044525330);
		a = ff(a, b, c, d, k[4], 7, -176418897);
		d = ff(d, a, b, c, k[5], 12, 1200080426);
		c = ff(c, d, a, b, k[6], 17, -1473231341);
		b = ff(b, c, d, a, k[7], 22, -45705983);
		a = ff(a, b, c, d, k[8], 7, 1770035416);
		d = ff(d, a, b, c, k[9], 12, -1958414417);
		c = ff(c, d, a, b, k[10], 17, -42063);
		b = ff(b, c, d, a, k[11], 22, -1990404162);
		a = ff(a, b, c, d, k[12], 7, 1804603682);
		d = ff(d, a, b, c, k[13], 12, -40341101);
		c = ff(c, d, a, b, k[14], 17, -1502002290);
		b = ff(b, c, d, a, k[15], 22, 1236535329);
		a = gg(a, b, c, d, k[1], 5, -165796510);
		d = gg(d, a, b, c, k[6], 9, -1069501632);
		c = gg(c, d, a, b, k[11], 14, 643717713);
		b = gg(b, c, d, a, k[0], 20, -373897302);
		a = gg(a, b, c, d, k[5], 5, -701558691);
		d = gg(d, a, b, c, k[10], 9, 38016083);
		c = gg(c, d, a, b, k[15], 14, -660478335);
		b = gg(b, c, d, a, k[4], 20, -405537848);
		a = gg(a, b, c, d, k[9], 5, 568446438);
		d = gg(d, a, b, c, k[14], 9, -1019803690);
		c = gg(c, d, a, b, k[3], 14, -187363961);
		b = gg(b, c, d, a, k[8], 20, 1163531501);
		a = gg(a, b, c, d, k[13], 5, -1444681467);
		d = gg(d, a, b, c, k[2], 9, -51403784);
		c = gg(c, d, a, b, k[7], 14, 1735328473);
		b = gg(b, c, d, a, k[12], 20, -1926607734);
		a = hh(a, b, c, d, k[5], 4, -378558);
		d = hh(d, a, b, c, k[8], 11, -2022574463);
		c = hh(c, d, a, b, k[11], 16, 1839030562);
		b = hh(b, c, d, a, k[14], 23, -35309556);
		a = hh(a, b, c, d, k[1], 4, -1530992060);
		d = hh(d, a, b, c, k[4], 11, 1272893353);
		c = hh(c, d, a, b, k[7], 16, -155497632);
		b = hh(b, c, d, a, k[10], 23, -1094730640);
		a = hh(a, b, c, d, k[13], 4, 681279174);
		d = hh(d, a, b, c, k[0], 11, -358537222);
		c = hh(c, d, a, b, k[3], 16, -722521979);
		b = hh(b, c, d, a, k[6], 23, 76029189);
		a = hh(a, b, c, d, k[9], 4, -640364487);
		d = hh(d, a, b, c, k[12], 11, -421815835);
		c = hh(c, d, a, b, k[15], 16, 530742520);
		b = hh(b, c, d, a, k[2], 23, -995338651);
		a = ii(a, b, c, d, k[0], 6, -198630844);
		d = ii(d, a, b, c, k[7], 10, 1126891415);
		c = ii(c, d, a, b, k[14], 15, -1416354905);
		b = ii(b, c, d, a, k[5], 21, -57434055);
		a = ii(a, b, c, d, k[12], 6, 1700485571);
		d = ii(d, a, b, c, k[3], 10, -1894986606);
		c = ii(c, d, a, b, k[10], 15, -1051523);
		b = ii(b, c, d, a, k[1], 21, -2054922799);
		a = ii(a, b, c, d, k[8], 6, 1873313359);
		d = ii(d, a, b, c, k[15], 10, -30611744);
		c = ii(c, d, a, b, k[6], 15, -1560198380);
		b = ii(b, c, d, a, k[13], 21, 1309151649);
		a = ii(a, b, c, d, k[4], 6, -145523070);
		d = ii(d, a, b, c, k[11], 10, -1120210379);
		c = ii(c, d, a, b, k[2], 15, 718787259);
		b = ii(b, c, d, a, k[9], 21, -343485551);
		x[0] = add32(a, x[0]);
		x[1] = add32(b, x[1]);
		x[2] = add32(c, x[2]);
		x[3] = add32(d, x[3]);
	}
	function cmn(q, a, b, x, s, t) {
		a = add32(add32(a, q), add32(x, t));
		return add32((a << s) | (a >>> (32 - s)), b);
	}
	function ff(a, b, c, d, x, s, t) {
		return cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}
	function gg(a, b, c, d, x, s, t) {
		return cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}
	function hh(a, b, c, d, x, s, t) {
		return cmn(b^c^d, a, b, x, s, t);
	}
	function ii(a, b, c, d, x, s, t) {
		return cmn(c^(b | (~d)), a, b, x, s, t);
	}
	function md51(s) {
		var n = s.length,
		state = [1732584193, -271733879, -1732584194, 271733878],
		i;
		for (i = 64; i <= s.length; i += 64) {
			md5cycle(state, md5blk(s.substring(i - 64, i)));
		}
		s = s.substring(i - 64);
		var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		for (i = 0; i < s.length; i++)
			tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
		tail[i >> 2] |= 0x80 << ((i % 4) << 3);
		if (i > 55) {
			md5cycle(state, tail);
			for (i = 0; i < 16; i++)
				tail[i] = 0;
		}
		tail[14] = n * 8;
		md5cycle(state, tail);
		return state;
	}
	function md5blk(s) {
		var md5blks = [],
		i;
		for (i = 0; i < 64; i += 4) {
			md5blks[i >> 2] = s.charCodeAt(i) +
				 (s.charCodeAt(i + 1) << 8) +
				 (s.charCodeAt(i + 2) << 16) +
				 (s.charCodeAt(i + 3) << 24);
		}
		return md5blks;
	}
	var hex_chr = '0123456789abcdef'.split('');
	function rhex(n) {
		var s = '',
		j = 0;
		for (; j < 4; j++)
			s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]+hex_chr[(n >> (j * 8)) & 0x0F];
		return s;
	}
	function hex(x) {
		for (var i = 0; i < x.length; i++)
			x[i] = rhex(x[i]);
		return x.join('');
	}
	ns.md5 = function (s) {
		return hex(md51(s));
	};
	function add32(a, b) {
		return (a + b) & 0xFFFFFFFF;
	}
	if (ns.md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
		add32 = function(x, y) {
			var lsw = (x & 0xFFFF) + (y & 0xFFFF),
			msw = (x >> 16) + (y >> 16) + (lsw >> 16);
			return (msw << 16) | (lsw & 0xFFFF);
		}
	}
})(KasperskyLab || {});
var KasperskyLab = (function ( ns) {
ns.NMSTransportSupported = false;
return ns;
}) (KasperskyLab || {});
var KasperskyLab = (function (ns)
{
ns.AjaxTransportSupported = true;
var ajaxRequestProvider = (function ()
	{
		var oldOpen = window.XMLHttpRequest && window.XMLHttpRequest.prototype.open;
		var oldSend = window.XMLHttpRequest && window.XMLHttpRequest.prototype.send;
		var oldXHR = window.XMLHttpRequest;
		var oldXDR = window.XDomainRequest;
		var oldSetRequestHeader = window.XMLHttpRequest && window.XMLHttpRequest.prototype.setRequestHeader;
		var m_enabled = true;
		function GetHostAndPort(url)
		{
			var hostBeginPos = url.indexOf('//');
			if (hostBeginPos == -1)
				return '';
			hostBeginPos += 2;
			var hostEndPos = url.indexOf('/', hostBeginPos);
			if (hostEndPos == -1)
				hostEndPos = url.length;
			var originParts = url.substring(0, hostEndPos).split('@');
			var origin = originParts.length > 1 ? originParts[1] : originParts[0];
			return origin[0] === "/" ? document.location.protocol + origin : origin; 
		}
		function IsCorsRequest(url)
		{
			var urlHostAndPort = GetHostAndPort(url);
			var pageHostAndPort = GetHostAndPort(document.location.href);
			return !!urlHostAndPort && !!pageHostAndPort && urlHostAndPort != pageHostAndPort;
		}
		function GetCommandUrl()
		{
			var commandSrc = ns.GetCommandSrc() + "/to/ajaxRequestNotify";
			return (document.location.protocol === "https:") ? commandSrc.replace("http:", "https:") : commandSrc;
		}
		function NormalizeUrl(url)
		{
			if (url.indexOf('//') == 0)
				return document.location.protocol + url;
			return url;
		}
		function IsInternalUrl(url)
		{
			return ns.IsRelativeTransport() ? false : url.indexOf(ns.PREFIX) == 0;
		}
		if (oldSend)
		{
			window.XMLHttpRequest.prototype.open = function() 
			{
				oldOpen.apply(this, [].slice.call(arguments));
				try
				{
					if (!m_enabled || arguments.length < 2 || typeof(arguments[0]) != 'string' || typeof(arguments[1]) != 'string' || !IsCorsRequest(arguments[1]))
						return;
					this.klIsCORSRequest = true;
					var targetUrl = NormalizeUrl(arguments[1])
					if (arguments[0].toLowerCase() != 'post' || IsInternalUrl(targetUrl))
						return;
					if (!ns.GetCommandSrc)
						return;
					var sendArguments;
					var request;
					var complete = false;
					var async = arguments.length < 3 || typeof(arguments[2]) != 'boolean' || arguments[2];
					var xhr = new oldXHR();
					xhr.open = oldOpen;
					xhr.send = oldSend;
					xhr.onprogress = function(){};
					xhr.onerror = function(){};			
					xhr.onloadend = function()
					{
						if (request)
							oldSend.apply(request, sendArguments);
						else
							complete = true;
					}
					xhr.open("POST", GetCommandUrl(), async);
					var command = {	method: "ajaxRequestNotify", parameters: JSON.stringify({url: targetUrl}), result: 0 };
					xhr.send(JSON.stringify(command));
				}
				catch (e)
				{
					ns.SessionLog(e);
					return;
				}
				this.RequestSend = function()
				{
					if (complete)
					{
						oldSend.apply(this, [].slice.call(arguments));
					}
					else
					{
						sendArguments = arguments.length > 0 ? 
							[ arguments[0] && arguments[0].slice ? arguments[0].slice() : arguments[0] ] :
							[];
						request = this;
					}
				}				
			};
			window.XMLHttpRequest.prototype.setRequestHeader = function() 
			{
				if (arguments.length && typeof(arguments[0]) == 'string' && arguments[0].toLowerCase().indexOf('x-') === 0)
				{
					this.klIsRequestedWithCustomHeader = true;
					if (this.RequestSend)
						delete this.RequestSend;
				}
				return oldSetRequestHeader.apply(this, [].slice.call(arguments));
			};
			window.XMLHttpRequest.prototype.send = function() 
			{
				if (m_enabled && !this.klIsCORSRequest && !this.klIsRequestedWithCustomHeader)
					oldSetRequestHeader.apply(this, ['X-Requested-With', 'XMLHttpRequest']);
				var fun = (m_enabled && this.RequestSend) ? this.RequestSend : oldSend;
  				return fun.apply(this, [].slice.call(arguments));
			};
		}
		return {
			GetAsyncRequest: function ()
				{
					var xmlhttp = oldXDR ? new oldXDR() : new oldXHR();
					if (!oldXDR) {
						xmlhttp.open = oldOpen;
						xmlhttp.send = oldSend;
					}
					xmlhttp.onprogress = function(){};
					return xmlhttp;
				},
			GetSyncRequest: function ()
				{
					var xmlhttp = new oldXHR();
					xmlhttp.open = oldOpen;
					xmlhttp.send = oldSend;
					xmlhttp.onprogress = function(){};
					return xmlhttp;
				}
		};
	})();
var restoreSessionCallback = function(){};
var PingPongCallReceiver = function(caller)
{
	var m_caller = caller;
	var m_isProductConnected = false;
	var m_pingWaitResponse = false;
	var m_requestDelay = ns.MaxRequestDelay;
	var m_requestTimer = null;
	var m_callCallback = function(){};
	var m_errorCallback = function(){};
	var m_updateCallback = function(){};
	function SendRequest()
	{
		try 
		{
			m_caller.Call(
				"from",
				null,
				null,
				 true,
				function(result, parameters, method)
				{
					m_pingWaitResponse = false;
					m_isProductConnected = true;
					if (parameters === "undefined" || method === "undefined") 
					{
						m_errorCallback('AJAX pong is not received. Product is deactivated');
						return;
					}
					if (method)
					{
						ns.SetTimeout(function () { SendRequest(); }, 0);
						m_callCallback(method, parameters);
					}
				},
				function(error)
				{
					m_pingWaitResponse = false;
					m_isProductConnected = false;
					m_enabled = false;
					restoreSessionCallback();
					m_errorCallback(error);
				});
			m_pingWaitResponse = true;
		}
		catch (e)
		{
			m_errorCallback('Ajax send ping exception: ' + (e.message || e));
		}
	}
	function Ping()
	{
		try
		{
			if (m_pingWaitResponse)
			{
				m_requestTimer = ns.SetTimeout(Ping, 100);
				return;
			}
			m_requestDelay = m_updateCallback();
			SendRequest();
			m_requestTimer = ns.SetTimeout(Ping, m_requestDelay);
		}
		catch (e)
		{
			m_errorCallback('Send ping request: ' + (e.message || e));
		}
	}
	this.StartReceive = function(callCallback, errorCallback, updateCallback)
	{
		m_callCallback = callCallback;
		m_errorCallback = errorCallback;
		m_updateCallback = updateCallback;
		m_requestDelay = m_updateCallback();
		m_requestTimer = ns.SetTimeout(Ping, m_requestDelay);
	};
	this.ForceReceive = function()
	{
		clearTimeout(m_requestTimer);
		m_requestTimer = ns.SetTimeout(Ping, 0);
	}
	this.StopReceive = function()
	{
		clearTimeout(m_requestTimer);
		m_requestTimer = null;
		m_callCallback = function(){};
		m_errorCallback = function(){};
		m_updateCallback = function(){};
	};
	this.IsStarted = function()
	{
		return m_requestTimer !== null;
	}
	this.IsProductConnected = function()
	{
		return m_isProductConnected;
	};
};
var LongPoolingReceiver = function(caller)
{
	var m_caller = caller;
	var m_isProductConnected = false;
	var m_isStarted = false;
	var m_callCallback = function(){};
	var m_errorCallback = function(){};
	function SendRequest()
	{
		try 
		{
			m_isProductConnected = true;
			m_caller.Call(
				"longpooling",
				null,
				null,
				 true,
				OnResponse,
				function(error)
				{
					m_isProductConnected = false;
					restoreSessionCallback();
					m_errorCallback(error);
				},
				true);
		}
		catch (e)
		{
			ns.SessionLog(e);
			m_errorCallback("Ajax send ping exception: " + (e.message || e));
		}
	}
	function OnResponse(result, parameters, method)
	{
		if (!ns.IsDefined(parameters) || !ns.IsDefined(method))
		{
			m_errorCallback('AJAX pong is not received. Product is deactivated');
			return;
		}
		ns.SetTimeout(function () { SendRequest(); }, 0);
		if (method)
			m_callCallback(method, parameters);
	}
	this.StartReceive = function(callCallback, errorCallback)
	{
		m_isStarted = true;
		m_callCallback = callCallback;
		m_errorCallback = errorCallback;
		SendRequest();
	};
	this.ForceReceive = function(){}
	this.StopReceive = function()
	{
		m_isStarted = false;
		m_callCallback = function(){};
		m_errorCallback = function(){};
	};
	this.IsStarted = function()
	{
		return m_isStarted;
	}
	this.IsProductConnected = function()
	{
		return m_isProductConnected;
	};
};
ns.AjaxCaller = function()
{
	var m_path = ns.PREFIX + ns.SIGNATURE;
	var m_longPooling;
	var m_longPoolingRequest;
	function NoCacheParameter() 
	{
		return "&nocache=" + Math.floor((1 + Math.random()) * 0x10000).toString(16);
	}
	function GetSpecialPlugins(predefined) 
	{
		return (predefined) ? "&plugins=" + encodeURIComponent(predefined) : "";
	}
	function PrepareRequestObject(command, commandAttribute, isPost, isAsync)
	{
		var request = isAsync ? ajaxRequestProvider.GetAsyncRequest() : ajaxRequestProvider.GetSyncRequest();
		if (request)
		{
			var urlPath = m_path + "/" + command;
			if (commandAttribute)
				urlPath += "/" + commandAttribute;
			if (isPost)
			{
				request.open("POST", urlPath);
			}
			else
			{
				if (urlPath.indexOf("?") === -1)
					urlPath += "?get";
				urlPath += NoCacheParameter();
				request.open("GET", urlPath, isAsync);
			}
			if (request.setRequestHeader && ns.IsRelativeTransport())
				request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		}
		return request;
	}
	function ClearRequest(request)
	{
		request.onerror = function(){};
		request.onload = function(){};
	}
	function AsyncCall(command, commandAttribute, data, callbackResult, callbackError, isLongPoolingCall)
	{
		try
		{
			var request = PrepareRequestObject(command, commandAttribute, data ? true : false, true);
			if (!request) 
			{
				callbackError && callbackError("Cannot create AJAX request!");
				return;
			}
			if (!m_longPooling)
			{
				var timeout = ns.SetTimeout(function () 
					{
						callbackError && callbackError("Cannot send AJAX request for calling " + command + "/" + commandAttribute);
						request.abort();
						ClearRequest(request);
					}, 120000);
			}
			request.onerror = function ()
				{
					clearTimeout(timeout);
					ClearRequest(request);
					callbackError && callbackError("AJAX request error for calling " + command + "/" + commandAttribute);
				};
			request.onload = function ()
				{
					clearTimeout(timeout);
					ClearRequest(request);
					if (request.responseText)
					{
						if (callbackResult)
							callbackResult(request.responseText);
						return;
					}
					if (callbackError)
						callbackError("AJAX request with unsupported url type!"); 
				};
			if (isLongPoolingCall)
				m_longPoolingRequest = request;
			request.send(data);
			ns.Log("Call native function " + command + "/" + commandAttribute);
		}
		catch (e)
		{
			if (callbackError)
				callbackError("AJAX request " + command  + "/" + commandAttribute + " exception: " + (e.message || e));
		}
	};
	function SyncCall(command, commandAttribute, data, callbackResult, callbackError)
	{
		try
		{
			var request = PrepareRequestObject(command, commandAttribute + "?" + ns.EncodeURI(data), false, false);
			if (!request)
			{
				callbackError && callbackError("Cannot create AJAX request!");
				return false;
			}
			request.send();
			if (request.status === 200)
			{
				if (callbackResult && request.responseText)
					callbackResult(request.responseText);
				request = null;
				return true;
			}
		}
		catch (e)
		{
			if (callbackError)
				callbackError("AJAX request " + command + " exception: " + (e.message || e));
		}
		return false;
	}
	this.Start = function(callbackSuccess)
	{
		callbackSuccess();
	}
	this.SendLog = function(message)
	{
		AsyncCall("log?" + encodeURIComponent(message));
	}
	this.Call = function(command, commandAttribute, data, isAsync, callbackResult, callbackError, isLongPoolingCall) 
	{
		var callFunction = (isAsync || !ns.IsDefined(isAsync)) ? AsyncCall : SyncCall;
		return callFunction(
			command,
			commandAttribute,
			data,
			function(responseText)
			{
				var commandResponse = ns.JSONParse(responseText);
				if (commandResponse.result === -1610612735)
				{
					callFunction(
						command,
						commandAttribute,
						data,
						function(responseText)
						{
							if (!callbackResult)
								return;
							commandResponse = ns.JSONParse(responseText);
							callbackResult(commandResponse.result, commandResponse.parameters, commandResponse.method);
						},
						callbackError,
						isLongPoolingCall);
				}
				else
				{
					if (callbackResult)
						callbackResult(commandResponse.result, commandResponse.parameters, commandResponse.method);
				}
			},
			callbackError,
			isLongPoolingCall);
	}
	this.Shutdown = function()
	{
		if (m_longPoolingRequest != undefined)
		{
			m_longPoolingRequest.abort();
			m_longPoolingRequest = undefined;
		}
	}
	this.InitCall = function(pluginsInitData, callbackResult, callbackError)
	{
		restoreSessionCallback = callbackError;
		var specialPlugins = GetSpecialPlugins(ns.PLUGINS_LIST);
		var serializedInitData = (pluginsInitData.length) ? "&data=" + encodeURIComponent(ns.JSONStringify({data : pluginsInitData})) : "";
		var isTopLevel = "&isTopLevel=" + (window && window == window.top).toString();
		if (ns.StartLocationHref == "data:text/html,chromewebdata")
			return callbackError();
		AsyncCall(
			"init?url=" + encodeURIComponent(ns.StartLocationHref) + specialPlugins + serializedInitData + isTopLevel,
			null,
			null,
			function(responseText)
			{
				try
				{
					var initSettings = ns.JSONParse(responseText);
					m_path = (ns.PREFIX || '/') + initSettings.ajaxId + '/' + initSettings.sessionId;
					m_longPooling = initSettings.longPooling;
					callbackResult(initSettings);
				} catch(e)
				{
					restoreSessionCallback && restoreSessionCallback("Error " + e.name + ": " + e.message);
				}
			},
			callbackError);
	}
	this.GetReceiver = function()
	{
		return m_longPooling ? new LongPoolingReceiver(this) : new PingPongCallReceiver(this);
	}
};
return ns;
}) (KasperskyLab || {});
var KasperskyLab = (function ( ns) {
ns.WebSocketTransportSupported = ns.IsDefined(window.WebSocket);
if (!ns.WebSocketTransportSupported)
	return ns;
var webSocketProvider = function()
	{
		var WebSocketObject = WebSocket;
		var WebSocketSend = WebSocket.prototype.send;
		var WebSocketClose = WebSocket.prototype.close;
		return {
			GetWebSocket: function(path)
			{
				var webSocket = new WebSocketObject(path);
				webSocket.send = WebSocketSend;
				webSocket.close = WebSocketClose;
				return webSocket;
			}
		}
	}();
ns.WebSocketCaller = function()
{
	var m_socket;
	var m_waitResponse = {};
	var m_callReceiver = function(){};
	var m_errorCallback = function(){};
	var m_callReceiverEnabled = false;
	var m_connected = false;
	var m_initialized = false;
	var m_deferredCalls = [];
	var m_wasCallbackErrorCalled = false;
	function GetWebSocket(callbackSuccess, callbackError)
	{
		var url = (ns.PREFIX === "/") 
			? document.location.protocol + "//" + document.location.host + ns.PREFIX 
			: ns.PREFIX;
		var webSocketPath = (url.indexOf("https:") === 0) 
			? "wss" + url.substr(5)
			: "ws" + url.substr(4);
		webSocketPath += ns.SIGNATURE + "/websocket?url=" + encodeURIComponent(ns.StartLocationHref) + "&nocache=" + (new Date().getTime());
		var webSocket;
		try
		{
			webSocket = webSocketProvider.GetWebSocket(webSocketPath);
		}
		catch (e)
		{
			throw e;
		}
		webSocket.onmessage = function(arg)
			{
				ProcessMessage(arg, callbackError);
			};
		webSocket.onerror = function()
			{
				if (!m_wasCallbackErrorCalled && callbackError)
					callbackError();
				m_wasCallbackErrorCalled = true;
			}
		webSocket.onopen = function()
			{
				m_wasCallbackErrorCalled = false;
				m_connected = true;
				if (callbackSuccess)
					callbackSuccess();
			}
		webSocket.onclose = function(closeEvent)
			{
				m_connected = false;
				if (closeEvent && closeEvent.code == 1006)
					webSocket.onerror(closeEvent);
				m_errorCallback("websocket closed");
			};
		return webSocket;
	}
	function ProcessMessage(arg, errorCallback)
	{
		try
		{
			m_wasCallbackErrorCalled = false;
			var response = ns.JSONParse(arg.data);
			if (m_waitResponse[response.callId])
			{
				var callWaiter = m_waitResponse[response.callId];
				delete m_waitResponse[response.callId];
				clearTimeout(callWaiter.timeout);
				if (callWaiter.callbackResult)
					callWaiter.callbackResult(response.commandData);
				return;
			}
			if (!m_initialized)
			{
				m_deferredCalls.push(arg);
				return;
			}
			if (response.command === "from")
			{
				var command = ns.JSONParse(response.commandData);
				m_callReceiver(command.method, command.parameters);
			}
			else if (response.command === "reconnect")
			{
				m_socket.onmessage = function(){};
				m_socket.onerror = function(){};
				m_socket.onopen = function(){};
				m_socket.onclose = function(){};
				m_socket.close();
				m_socket = GetWebSocket(function()
					{
						CallImpl("restore", "", response.commandData);
					},
					errorCallback);
			}
		}
		catch (e)
		{
			ns.SessionLog(e)
		}
	}
	function CallImpl(command, commandAttribute, data, callbackResult, callbackError)
	{
		try
		{
			var callId = 0;
			if (callbackResult || callbackError)
			{
				callId = Math.floor((1 + Math.random()) * 0x10000);
				var timeout = ns.SetTimeout(function()
					{
						delete m_waitResponse[callId];
						if (callbackError)
							callbackError("websocket call timeout for " + command  + "/" + commandAttribute);
					}, 120000);
				var callWaiter = 
					{
						callId: callId,
						callbackResult: callbackResult,
						timeout: timeout
					};
				m_waitResponse[callId] = callWaiter;
			}
			m_socket.send(ns.JSONStringify(
				{
					callId: callId,
					command: command,
					commandAttribute: commandAttribute || "",
					commandData: data || ""
				}));
		}
		catch (e)
		{
			if (callbackError)
				callbackError("websocket call " + command  + "/" + commandAttribute + " exception: " + (e.message || e));
		}
	}
	this.Start = function(callbackSuccess, callbackError)
	{
		try
		{
			m_socket = GetWebSocket(callbackSuccess, callbackError);
		}
		catch (e)
		{
			if (callbackError)
				callbackError("websocket start exception: " + (e.message || e));
		}
	}
	this.SendLog = function(message)
	{
		CallImpl("log", null, message);
	}
	this.Call = function(command, commandAttribute, data, isAsync, callbackResult, callbackError) 
	{
		if (ns.IsDefined(isAsync) && !isAsync)
			return false;
		CallImpl(
			command, 
			commandAttribute, 
			data,
			callbackResult 
				? 	function(responseText)
					{
						if (callbackResult)
						{
							var command = ns.JSONParse(responseText);
							callbackResult(command.result, command.parameters, command.method);
						}
					}
				: null,
			callbackError);
	}
	this.InitCall = function(pluginsInitData, callbackResult, callbackError)
	{
		var initData = 
			{
				url: ns.StartLocationHref,
				plugins: ns.PLUGINS_LIST,
				data: { data : pluginsInitData },
				isTopLevel: (window && window == window.top)
			};
		if (ns.StartLocationHref == "data:text/html,chromewebdata")
			return callbackError();
		CallImpl("init", null, ns.JSONStringify(initData),
			function(responseText)
			{
				m_initialized = true;
				var initSettings = ns.JSONParse(responseText);
				if (initSettings.Shutdown !== undefined)
					return;
				callbackResult(initSettings);
				for (var i = 0; i < m_deferredCalls.length; ++i)
					ProcessMessage(m_deferredCalls[i], callbackError);
				m_deferredCalls = [];
			},
			callbackError);
	}
	this.GetReceiver = function()
	{
		return this;
	}
	this.StartReceive = function(callMethod, errorCallback)
	{
		m_callReceiverEnabled = true;
		m_callReceiver = callMethod;
		m_errorCallback = errorCallback;
	}
	this.ForceReceive = function(){};
	this.StopReceive = function()
	{
		m_callReceiverEnabled = false;
		m_callReceiver = function(){};
		m_errorCallback = function(){};
		if (m_socket)
		{
			m_connected = false;
			m_socket.onmessage = function(){};
			m_socket.onerror = function(){};
			m_socket.onopen = function(){};
			m_socket.onclose = function(){};
			m_socket.close();
			m_socket = null;
		}
	}
	this.IsStarted = function()
	{
		return m_callReceiverEnabled;
	}
	this.IsProductConnected = function()
	{
		return m_connected;
	}
}
return ns;
}) (KasperskyLab || {});
var kaspersyLabSessionInstance = null;
(function ( ns) {
	var currentLocationHref = document.location.href;
	if (ns.WORK_IDENTIFIERS)
	{
		var workIdentifiers = ns.WORK_IDENTIFIERS.split(",");
		for (var i = 0; i < workIdentifiers.length; ++i)
		{
			if (window[workIdentifiers[i]])
			{
				ns.AddRunner = function(){};
				return;
			}
			window[workIdentifiers[i]] = true;
		}
	}
	if (ns.INJECT_ID)
		removeThisScriptElement(ns.INJECT_ID);
	function removeThisScriptElement(injectId)
	{
		var pattern = injectId.toLowerCase();
		for (var i = 0, scriptsCount = document.scripts.length; i < scriptsCount; ++i) 
		{
			var tag = document.scripts[i];
			if (typeof tag.src === 'string' && tag.src.length > 45 &&
				tag.src.toLowerCase().indexOf(pattern) > 0 &&
				/\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\/main.js/.test(tag.src))
			{
				tag.parentElement.removeChild(tag);
				break; 
			}
		}
	}
	var CallReceiver = function (caller) {
		var m_plugins = {};
		var m_receiver = caller.GetReceiver();
		var m_caller = caller;
		this.RegisterMethod = function (methodName, callback) {
			var pluginId = GetPluginIdFromMethodName(methodName);
			if (pluginId) {
				var methods = GetPluginMethods(pluginId);
				if (methods) {
					if (methods[methodName]) {
						throw 'Already registered method ' + methodName;
					}
					methods[methodName] = callback;
				}
				else {
					throw 'Cannot registered ' + methodName;
				}
			}
		};
		this.RegisterPlugin = function (pluginId, callbackPing, callbackError) {
			if (m_plugins[pluginId]) {
				throw 'Already started plugin ' + pluginId;
			}
			var plugin = {
				onError: callbackError,
				onPing: callbackPing,
				methods: {}
			};
			m_plugins[pluginId] = plugin;
			if (!m_receiver.IsStarted())
				m_receiver.StartReceive(CallMethod, ReportError, UpdateDelay);
		};
		this.UnregisterPlugin = function (pluginId) {
			delete m_plugins[pluginId];
			if (IsPluginListEmpty())
				m_receiver.StopReceive();
		};
		this.ForceReceive = function()
		{
			m_receiver.ForceReceive();
		}
		this.UnregisterAll = function () {
			if (IsPluginListEmpty())
				return;
			m_receiver.StopReceive();
			m_plugins = {};
		};
		this.IsEmpty = IsPluginListEmpty;
		function IsPluginListEmpty() {
			for (var key in m_plugins) {
				if (m_plugins.hasOwnProperty(key))
					return false;
			}
			return true;
		}
		this.IsProductConnected = function()
		{
			return m_receiver.IsProductConnected();
		}
		function UpdateDelay() {
			var newDelay = ns.MaxRequestDelay;
			var currentTime = ns.GetCurrentTime();
			for (var pluginId in m_plugins) {
				try {
					var onPing = m_plugins[pluginId].onPing;
					if (onPing) {
						var delay = onPing(currentTime);
						if (delay < newDelay && delay > 0 && delay < ns.MaxRequestDelay) {
							newDelay = delay;
						}
					}
				}
				catch (e) {
					ReportPluginError(pluginId, 'UpdateDelay: ' + (e.message || e));
				}
			}
			return newDelay;
		}
		function ReportPluginError(pluginId, status) {
			var onError = m_plugins[pluginId].onError;
			if (onError)
				onError(status);
		}
		function ReportError(status) {
			for (var pluginId in m_plugins)
				ReportPluginError(pluginId, status);
		}
		function GetPluginIdFromMethodName(methodName) {
			if (methodName) {
				var names = methodName.split('.', 2);
				if (names.length === 2) {
					return names[0];
				}
			}
			return null;
		}
		function GetPluginMethods(pluginId) {
			var plugin = m_plugins[pluginId];
			return plugin ? plugin.methods : null;
		}
		function CallPluginMethod(pluginId, methodName, args) {
			var methods = GetPluginMethods(pluginId);
			if (methods) {
				var callback = methods[methodName];
				if (callback) {
					try {						
						if (args)
							callback(ns.JSONParse(args));
						else
							callback();
						m_caller.SendLog(methodName + " executed.");
						return true;
					}
					catch (e) {
						m_caller.SendLog("Call " + methodName + " in plugin " + pluginId + " error: " + (e.message || e));
					}
				}
			}
			m_caller.SendLog("Cannot call " + methodName + " for plugin " + pluginId);
			return false;
		}
		function CallMethod(methodName, args)
		{
			ns.Log("Try to find js callback " + methodName);
			var pluginId = GetPluginIdFromMethodName(methodName);
			if (pluginId)
				CallPluginMethod(pluginId, methodName, args);
		}
	};
	var KasperskyLabSessionClass = function (caller) {
		var self = this;
		var m_caller = caller;
		var m_callReceiver = new CallReceiver(caller);
		function CallImpl(methodName, argsObj, callbackResult, callbackError, isAsync) {
			var data = (argsObj) 
				? ns.JSONStringify(
					{
						result: 0,
						method: methodName,
						parameters: ns.JSONStringify(argsObj)
					})
				: null;
			var callback = function(result, args, method)
				{
					if (callbackResult)
						callbackResult(result, args ? ns.JSONParse(args) : null, method);
				};
			return m_caller.Call("to", methodName, data, isAsync, callback, callbackError);
		}
		function Call(methodName, arrayOfArgs, callbackResult, callbackError) {
			CallImpl(methodName, arrayOfArgs, callbackResult, callbackError, true);
		}
		function SyncCall(methodName, arrayOfArgs, callbackResult, callbackError) {
			return CallImpl(methodName, arrayOfArgs, callbackResult, callbackError, false);
		}
		function Stop() {
			try {
				m_callReceiver.UnregisterAll();
				ns.Log("session stopped");
				if (m_callReceiver.IsProductConnected())
				{
					if (!m_caller.Call("shutdown", null, null, false))
						m_caller.Call("shutdown");
				}
				if (m_caller.Shutdown)
					m_caller.Shutdown();				
			}
			catch (e) {
			}
		}
		function DeactivatePlugin(pluginId) {
			ns.Log('DeactivatePlugin ' + pluginId);
			m_callReceiver.UnregisterPlugin(pluginId);
			if (m_callReceiver.IsEmpty()) {
				Stop();
			}
		}
		function ActivatePlugin(pluginId, callbackPing, callbackError) {
			ns.Log('ActivatePlugin ' + pluginId);
			m_callReceiver.RegisterPlugin(pluginId, callbackPing, function (e) {
				callbackError && callbackError(e);
				m_callReceiver.UnregisterPlugin(pluginId);
				if (m_callReceiver.IsEmpty()) {
					Stop();
				}
			});
		}
		function RegisterMethod(methodName, callback) {
			ns.Log('RegisterMethod ' + methodName);
			m_callReceiver.RegisterMethod(methodName, callback);
		}
		this.Log = function(error) 
		{
			try
			{
				var msg = "" + (error.message || error);
				if (error.stack)
					msg += "\r\n" + error.stack;
				msg && msg.length <= 2048 ? m_caller.SendLog(msg) : m_caller.SendLog(msg.substring(0, 2048) + '<...>');
			}
			catch(e)
			{
				ns.Log(e.message || e);
			}
		};
		this.ForceReceive = function()
		{
			m_callReceiver.ForceReceive();
		}
		this.InitializePlugin = function (init) {
			init(
				function () {
					ActivatePlugin.apply(self, arguments);
				},
				function () {
					RegisterMethod.apply(self, arguments);
				},
				function () {
					Call.apply(self, arguments);
				},
				function () {
					DeactivatePlugin.apply(self, arguments);
				},
				function () {
					return SyncCall.apply(self, arguments);
				}
			);
		};
		ns.AddEventListener(window, "unload", function() 
			{
				if (!m_callReceiver.IsEmpty())
					Stop();
			});
	};
	var runners = {};
	var pluginsInitData = [];
	ns.AddRunner = function(pluginName, runnerFunc, initParameters)
	{
		runners[pluginName] = runnerFunc;
		if (initParameters)
		{
			pluginsInitData.push({plugin: pluginName, parameters: ns.JSONStringify(initParameters)});
		}
	};
	ns.SessionLog = function(e)
	{
		if (kaspersyLabSessionInstance)
			kaspersyLabSessionInstance.Log(e);
	}
	ns.ContentSecurityPolicyNonceAttribute = ns.CSP_NONCE;
	var SupportedCallerProvider = function()
	{
		var m_current = 0;
		var m_supportedCallers = [];
		if (ns.NMSTransportSupported)
			m_supportedCallers.push(new ns.NMSCaller);
		if (ns.WebSocketTransportSupported)
			m_supportedCallers.push(new ns.WebSocketCaller);
		if (ns.AjaxTransportSupported)
			m_supportedCallers.push(new ns.AjaxCaller);
		function FindSupportedImpl(callbackSuccess)
		{
			if (m_current < m_supportedCallers.length)
			{
				var caller = m_supportedCallers[m_current++];
				caller.Start(function(){callbackSuccess(caller);}, function(){FindSupportedImpl(callbackSuccess);});
			}
			else
			{
				m_current = 0;
				PostponeInit();
			}
		}
		this.FindSupported = function(callbackSuccess)
		{
			FindSupportedImpl(callbackSuccess);
		}
	}
	function Init()
	{
		var callerProvider = new SupportedCallerProvider;
		callerProvider.FindSupported(
			function(caller) 
			{
				caller.InitCall(
					pluginsInitData,
					function(initSettings)
					{
						ns.IsRtl = initSettings.rtl;
						ns.RES_SIGNATURE = initSettings.resSignature;
						ns.GetResourceSrc = function (resourceName)
						{
							return ns.PREFIX + ns.RES_SIGNATURE + resourceName;
						};
						ns.GetCommandSrc = function()
						{
							return (ns.PREFIX || "/") + initSettings.ajaxId + "/" + initSettings.sessionId;
						}
						kaspersyLabSessionInstance = new KasperskyLabSessionClass(caller);
						var plugins = initSettings.plugins;
						for (var i = 0, pluginsCount = plugins.length; i < pluginsCount; ++i)
						{
							var plugin = plugins[i];
							var pluginRunnerFunction = runners[plugin.name];
							if (pluginRunnerFunction)
								pluginRunnerFunction(KasperskyLab, kaspersyLabSessionInstance, plugin.settings, plugin.localization);
						}
					},
					function()
					{
						PostponeInit();
					});
			});
	}
	var lastPostponedInitTime = (new Date()).getTime();
	var postponedInitTimeout = null;
	function PostponeInit()
	{
		var nowPostponeTime = (new Date()).getTime();
		var postponeDelay = (nowPostponeTime - lastPostponedInitTime) > 5000 ? 200 : 60 * 1000;
		lastPostponedInitTime = nowPostponeTime;
		clearTimeout(postponedInitTimeout)
		postponedInitTimeout = ns.SetTimeout(function () { Init(); }, postponeDelay);
	}
	ns.SetTimeout(function () { Init(); }, 0);
})(KasperskyLab);
KasperskyLab.AddRunner("pi", function (ns, session, settings, locales) {
    var ProductInfo = function () {
        var m_signRequest = [];
        var m_callFunction;
        session.InitializePlugin(function (activatePlugin, registerMethod, callFunction, deactivatePlugin) {
            m_callFunction = callFunction;
            activatePlugin('pi', OnPing, OnError);
            registerMethod('pi.signReady', SignReady);
        });
        function OnError(e) {
            session.Log('ERR PI - ' + (e.message || e));
        }
        function OnPing(currentTime) {
            return ns.MaxRequestDelay;
        }
        function SignReady(args) {
            if (!m_signRequest[args.challenge]) {
                session.Log('ProductInfo error: invalid challenge');
                return;
            }
            m_signRequest[args.challenge](args.webSignature);
        }
        window.KasperskyLab = (function (object) {
            var thisProductId = locales["ProductName"] + " " + locales["ProductVersion"];
            var thisProduct = {
                'productName': locales["ProductName"],
                'productVersion': locales["ProductVersion"],
                'productPPCSID': locales["ProductPPCSID"],
                'features': {
                    'isSafeMoneyInstalled': locales["IsSafeMoneyInstalled"],
                    'isSafeMoneyProtectionEnabled': settings.isSafeMoneyProtectionEnabled
                }
            };
            if (locales["DeviceId"])
                thisProduct['deviceId'] = locales["DeviceId"];
            object._products = object._products || {};
            object._products[thisProductId] = thisProduct;
            object.getInstalledProducts = function () {
                var products = [];
                for (var productId in object._products) {
                    products.push(object._products[productId]);
                }
                return products;
            };
            object.initProductInfoProvider = function (signedProductInfoProvider) {
                delete object.initProductInfoProvider;
                object._products2 = object._products2 || {};
                object._products2[thisProductId] = signedProductInfoProvider;
                object.getInstalledProducts2 = function (challenge, timeoutMs, callback) {
                    for (var productId in object._products2) {
                        object._products2[productId](challenge, timeoutMs, callback);
                    }
                };
            };
            return object;
        })(window.KasperskyLab || {});
        window.KasperskyLab.initProductInfoProvider(function (challenge, timeoutMs, callback) {
            m_signRequest[challenge] = callback;
            m_callFunction('pi.signedProductInfo', {challenge: challenge, timeout: timeoutMs},
                function (result) {
                    if (result != 0) {
                        m_signRequest[challenge] = null;
                    }
                },
                function (e) {
                    OnError(e);
                    m_deactivateFunction('pi');
                });
        });
    };
    try {
        new ProductInfo();
        if (window.dispatchEvent && typeof (window.CustomEvent) == "function") {
            window.dispatchEvent(new CustomEvent("cb.ready"));
        }
    }
    catch (e) {
        session.Log('ProductInfo exception ' + (e.message || e));
    }
});
KasperskyLab.AddRunner("pc", function (ns, session, settings, locales)
{
	var PasswordControl = function()
	{
		var m_callFunction = function(){};
		var m_balloon = null;
		function OnPing()
		{
			return ns.MaxRequestDelay;
		}
		function OnError(e)
		{
			session.Log("ERR pc - " + (e.message || e));
		}
		session.InitializePlugin(
			function(activatePlugin, registerMethod, callFunction)
			{
				m_callFunction = callFunction;
				activatePlugin("pc", OnPing, OnError);
				registerMethod('pc.disable', function () {
				    if (m_balloon)
				        m_balloon.Disable();
				});
			});
		m_balloon =  new ns.PasswordControlBalloon(settings, locales, m_callFunction, session) ;
	}
	var instance = null;
	ns.RunModule(function()
	{
		try
		{
			if (!instance)
				instance = new PasswordControl;
		}
		catch(e)
		{
			session.Log("PasswordControl exception: " + (e.message || e));
		}
	});
});
(function (ns) {
ns.PasswordControlBalloon = function(settings, locales, callFunction, session)
{
	var m_balloon = (window == window.top) ? new ns.Balloon2("pc", "/pc/password_control_balloon.html", "/pc/tooltip.css", session, GetCoord, OnCloseHandler, locales, OnGetDataCallback) : null;
	var m_focusedElement = null;
	var m_lastChange = null;
	var m_hideTimer = null;
	var m_displayBalloon = false;
	var m_currentVerdictClassName;
	var m_currentPasswordStrength;
	var m_currentArrowClassName = "left";
	var m_focusEventName;
	var m_blurEventName;
	var m_focusTimeOut = null;
	var m_domParser = ns.GetDomParser(session);
	var m_delaySkipFocusEvent = false;
	var m_delayTimeout = 200;
	if (window.addEventListener)
	{
		m_focusEventName = "focus";
		m_blurEventName = "blur";
	}
	else
	{
		m_focusEventName = "focusin";
		m_blurEventName = "focusout";
	}
	function OnCloseHandler(closeAction)
	{
		m_displayBalloon = false;
		switch(closeAction)
		{
		case 1:
			OnCloseButton();
			break;
		case 2:
			OnSkipNotification();
			break;
		case 3:
			OnInstallButton();
			break;
		default:
			ns.SessionLog("PC: Unknown close action " + closeAction);
			break;
		};
		clearTimeout(m_focusTimeOut);
		m_delaySkipFocusEvent = true;
		ns.SetTimeout(function(){m_delaySkipFocusEvent = false;}, m_delayTimeout);
	}
	function OnGetDataCallback(data)
	{
		if (data.isNeedRestoreFocus && m_focusedElement)
		{
			clearTimeout(m_hideTimer);
			m_focusedElement.focus();
		}
	}
	function OnCloseButton()
	{
		if (m_focusedElement)
		{
			m_focusedElement.focus();
			ns.RemoveEventListener(m_focusedElement, "input", OnInput);
			ns.RemoveEventListener(m_focusedElement, m_blurEventName, OnBlur);
		}
		m_focusedElement = null;
		m_lastChange = null;
	}
	function OnSkipNotification()
	{
		DisableImpl();
		callFunction("pc.SkipNotification");
	}
	function OnInstallButton()
	{
		OnCloseButton();
		callFunction("pc.Download");
	}
	this.Disable = function()
	{
		DisableImpl();
	}
	function DisableImpl()
	{
		if (m_balloon)
		{
			m_balloon.Hide();
			m_balloon = null;
		}
		if (m_focusedElement)
		{
			ns.RemoveEventListener(m_focusedElement, m_blurEventName, OnBlur);
			ns.RemoveEventListener(m_focusedElement, "input", OnInput);
			ns.RemoveEventListener(m_focusedElement, "keyup", OnInput);
			ns.RemoveEventListener(m_focusedElement, "keydown", OnInput);
		}
		ns.SessionLog("Disabling password control");
	}
	function GeneratePopupAttributes()
	{
		if (!m_focusedElement)
			return;
		if (!m_focusedElement.value)
		{
			m_currentVerdictClassName = "popup_empty";
			m_currentPasswordStrength = null;
		}
		else
		{
			m_currentVerdictClassName = "";
			m_currentPasswordStrength = ns.CheckPasswordStrength(m_focusedElement.value);
		}
	}
	function GetCoord(balloonSize)
	{
		var coord = {x: 0, y: 0};
		if (!m_focusedElement)
			return coord;
		var elementRect = m_focusedElement.getBoundingClientRect();
		var clientHeight = ns.GetPageHeight();
		var clientWidth = ns.GetPageWidth();
		var newArrowClassName;
		if (elementRect.right + balloonSize.width <= clientWidth)
		{
			newArrowClassName = "left";
			coord.x = elementRect.right;
			coord.y = elementRect.top - 80 + (elementRect.bottom - elementRect.top) / 2;
		}
		else if (elementRect.left - balloonSize.width >= 0)
		{
			newArrowClassName = "right";
			coord.x = elementRect.left - balloonSize.width;
			coord.y = elementRect.top  - 80 + (elementRect.bottom - elementRect.top) / 2;
		}
		else if (elementRect.bottom + balloonSize.height < clientHeight)
		{
			newArrowClassName = "top";
			coord.x = elementRect.left  - 13;
			coord.y = elementRect.bottom;
		}
		else if (elementRect.top - balloonSize.height > 0)
		{
			newArrowClassName = "bottom";
			coord.x = elementRect.left  - 13;
			coord.y = elementRect.top - balloonSize.height;
		}
		else
		{
			newArrowClassName = "top";
			coord.x = elementRect.left - 13;
			coord.y = elementRect.bottom;
		}
		if (newArrowClassName !== m_currentArrowClassName)
		{
			m_currentArrowClassName = newArrowClassName;
			ns.SetTimeout(UpdateBalloon, 0);
		}
		var scroll = ns.GetPageScroll();
		coord.x += scroll.left;
		coord.y += scroll.top;
		return coord;
	}
	function GetBalloonData()
	{
		return {strength: m_currentPasswordStrength, arrow: m_currentArrowClassName};
	}
	function UpdateBalloon()
	{
		if (!m_balloon)
			return;
		m_balloon.Update(m_currentVerdictClassName, GetBalloonData());
	}
	function ShowBalloon()
	{
		if (!m_balloon)
			return;
		GeneratePopupAttributes();
		if (!m_displayBalloon)
		{
			callFunction("pc.Tooltip");
			m_displayBalloon = true;
			m_balloon.Show(m_currentVerdictClassName, GetBalloonData());
		}
		else
		{
			UpdateBalloon()
		}
	}
	function HideBalloon()
	{
		m_balloon.Hide();
		m_displayBalloon = false;
	}
	function OnInput()
	{
		try
		{
			if (!m_focusedElement)
				return;
			if (m_lastChange == m_focusedElement.value)
				return;
			ShowBalloon();
			m_lastChange = m_focusedElement.value;
		}
		catch(e)
		{
			ns.SessionLog(e);
		}
	}
	function OnPasswordFocused(element)
	{
		m_focusedElement = element;
		clearTimeout(m_hideTimer);
		ShowBalloon();
		m_balloon.UpdatePosition();
		ns.AddRemovableEventListener(element, m_blurEventName, OnBlur);
		ns.AddRemovableEventListener(element, "input", OnInput);
		ns.AddRemovableEventListener(element, "keyup", OnInput);
		ns.AddRemovableEventListener(element, "keydown", OnInput);
	}
	function IsPasswordInputCallback(result, passwords, element)
	{
		if (result == 0 && element && passwords)
		{
			for (var i = 0; i < passwords.length; i++)
			{
				if (element == document.querySelector(passwords[i]))
				{
					return true;
				}
			}
		}
		return false;
	}
	function CheckSelectorCallback(element)
	{
		return function (result, passwords) 
		{
			if(IsPasswordInputCallback(result, passwords, element))
			{
				OnPasswordFocused(element);
			}
		}
	}
	function ShowBalloonOnPasswordInput(element)
	{
		m_domParser.GetNewPasswordSelectors(CheckSelectorCallback(element));
	}
	function OnFocus(evt)
	{
		if (!m_balloon)
			return;
		if (m_delaySkipFocusEvent)
		{
			ns.SessionLog("Skip focus event after click button in balloon");
			return;
		}
		var element = evt.target || evt.srcElement;
		m_focusTimeOut = ns.SetTimeout(function ()
		{
			if (element.type === "password")   
			{
				ShowBalloonOnPasswordInput(element);
			}
		}, 0);
	}
	function OnBlur()
	{
		try
		{
			clearTimeout(m_focusTimeOut);
			if (m_focusedElement)
			{
				clearTimeout(m_hideTimer);
				m_hideTimer = ns.SetTimeout(function (){HideBalloon();}, 300);
				ns.RemoveEventListener(m_focusedElement, m_blurEventName, OnBlur);
				ns.RemoveEventListener(m_focusedElement, "input", OnInput);
				ns.RemoveEventListener(m_focusedElement, "keyup", OnInput);
				ns.RemoveEventListener(m_focusedElement, "keydown", OnInput);
				m_lastChange = null;
			}
		}
		catch (e)
		{
			ns.SessionLog(e);
		}
	}
	ns.AddEventListener(document, m_focusEventName, OnFocus);
}
}) (KasperskyLab || {});
(function (ns) {
var PasswordStrengthChecker = (function () {
    var checker = null;
    function KasPassCheck() {
        var reasons = maa(5);
        this.tbls = [
            {
                vp: [[0, 0.0866, 0.408, 0.474], [0.0193, 0.413, 0.488, 0.683], [0, 0.106, 0.606, 0.756]],
                sf: [0.0393, 0.0393, 0.0393, 0.0393, 0.0393, 0.0393, 0.0393, 0.0393, 0.0393, 0.0393, 0.0393, 0.0393, 0.0393, 0.0393, 0.0361, 0.0295, 0.0328, 0.0393, 0.0393, 0.0393, 0.0393, 0.0393, 0.0393, 0.0393, 0.0393, 0.0361],
                lf: [[0xc0000200, 0x880a2202, 0xa002002a, 696320, 664064, 0xaa000002, 0x80a02ac0, 10248, 548044800, 35782688, 704643106, 545390754, 33564680, 59944, 8388608, 713687048, 0x80000aa, 0x88008008, 569504, 2, 686293120, 570468874, 2048, 9080320, 0, 548929536, 0x88000002, 0xc008202a, 131874, 545423360, 8915490, 0x82800802, 805838850, 0xa88000c0, 0x82a28000, 33687680, 0x80000088, 772317184, 164002, 663584, 44091400, 526464, 587202560], [0xc0000000, 512, 0, 524288, 0, 536870912, 128, 0, 131072, 0, 0x8000000, 32, 0, 49152, 0, 33554432, 12, 0, 12288, 0, 8388608, 2, 0, 3072, 0, 3145728, 0, 0x80000000, 512, 0, 524288, 0, 536870912, 128, 0, 131072, 0, 0xc000000, 32, 0, 32768, 0, 33554432], [0xc0202000, 525056, 0, 571211776, 0xa0000000, 807411712, 192, 131072, 0x88030200, 0, 0xc080008, 8240, 536870912, 51200, 0x82000802, 50331648, 0x8000888, 557056, 539500704, 2048, 0xc00020, 8388611, 8192, 134144, 0x8800800, 538970112, 32768, 0xe0000000, 2824, 2056, 786432, 524288, 813694976, 139456, 8, 197248, 2050, 0xc0a0000, 33554480, 8388616, 49664, 2, 50331648]]
            },
            {
                vp: [[0.0208, 0.0443, 0.0808, 0.128], [0.0217, 0.0396, 0.0617, 0.0921], [0.0179, 0.0351, 0.0588, 0.0911], [0.0201, 0.0378, 0.0606, 0.0913]],
                sf: [0.0746, 0.0367, 0.0419, 0.0391, 0.0767, 0.0307, 0.029, 0.0354, 0.0546, 0.026, 0.0283, 0.0454, 0.0349, 0.0568, 0.0501, 0.0291, 0.0136, 0.0551, 0.0557, 0.0541, 0.0315, 0.0214, 0.0187, 0.0149, 0.0303, 0.0155],
                lf: [[704676528, 973081256, 0x8228228, 0x8888388, 673316874, 772407426, 0xa8088a80, 44055040, 0x8aa28a2, 0x82280880, 0xcaa2282a, 0x800e0e0a, 8398848, 0x8a8802b0, 704645288, 547522602, 0x8a0e0a0, 0x880a808c, 738992256, 0xa808e8c0, 0x808a0880, 0x88ac8802, 0x80a0002a, 178730, 0x880c0a28, 547530752, 0xaa828222, 0xaaa88c2c, 0x80080a8, 8946304, 0xa0b8008, 0x8c280282, 0xa808aaa8, 0xa2a22a00, 0xa0e0a00, 0x80a000e0, 0xc280282a, 698888, 0x8a2a028, 0xa8a02228, 0xa0088a8, 0x8a2802a, 0xa000000], [0xcac2ca28, 704645802, 0xa2282a0, 0x8a2e0a2, 0xa82a800a, 0xa828ab82, 0xa008cac2, 0x82282f00, 0xb8a0a2a, 0x82a008aa, 0x82a2282a, 698376, 732143624, 0xcaca8a28, 704643754, 598344352, 0x88a8082, 0xb82a808a, 0xa8080b82, 0xa2088a80, 0x82383a00, 0x8ac28aa, 0x82a00882, 0xc08a282a, 567304, 581148672, 0xaaeaa02a, 0xaa80aaac, 673874080, 0x8c8c0c2, 0xa82a800a, 0x8e082b83, 0xa008aaea, 0x8a282a80, 0x8a828a3, 0x83a008a2, 0x8082283a, 9087530, 0xaa82a828, 0xaa82a828, 0xaaa02aaa, 0xaaaa2a0, 0xa000000], [0xcac2c2a8, 713067178, 0xaaa282a0, 0x8aae282, 0xaa2aa08a, 0xaaaaaa82, 0xa008cac2, 0x82a82a80, 0x8aaa2aaa, 0x82b00aaa, 0xaaa2a82a, 9087658, 0xaaa2a008, 0xcac282a8, 713067178, 715817642, 0x8aaaaaa, 0xa82a008a, 0xaea8aa82, 0xa008caca, 0xcaa82a80, 0xaae28aa, 0x82a808ca, 0xc2c2a82a, 0x808aaaa8, 0xaaa2e008, 0xaaaaaaaa, 0xaaaaaaac, 0xa8ab82a0, 0x88ac88a, 0xba3a800a, 0xaeaaab82, 0xa008cac2, 0xc2a82a80, 0x8aaaaaaa, 0x82aa08ab, 0xaa8aaa2b, 9087658, 0xaaaaaa28, 0xaaaaaaa8, 715164330, 0xaaaaaaaa, 704643072], [0xcac08238, 704645806, 682263200, 0x8aae08a, 0xa82a008a, 0xae2aaa82, 0xa0088ac0, 0x82b83a00, 0x8aaa2aaa, 0x82a208aa, 0xeaaa282a, 9088554, 0xa282a008, 0xcac082b8, 973114026, 715784866, 0x8aaa2aa, 673849484, 0xac282282, 0xa008cac2, 0x82a82a80, 0x8aac0822, 0x82a008ca, 0xc082382a, 8956968, 578985992, 0xaaaaaaaa, 0xabaa8cac, 673350304, 0x8cac28a, 0xa82a000a, 0xae28a282, 0xa0088ac0, 0x82b83a80, 0x8aae2aa2, 0x82a80882, 0xc28aa82a, 9087530, 0xaaa2a22a, 0xaaa2aaa8, 715164330, 0xaaaa8aaa, 0xa000000]]
            }
        ];
        this.prob = function (i, j, l) {
            return p(i, j, l, this.tbls[0].lf);
        };
        this.calc = function (t) {
            var rval = 0;
            for (var i = 0; i < this.tbls.length; ++i) {
                var s = Math.max.apply(null, avg(clc(t, this.tbls[i])));
                reasons[i] = (s < 1.5 ? 0 : (s / 1.5));
                rval = Math.max(s, rval);
            }
            var l = lk(t);
            reasons[2] = (l >= 1 ? 0 : 1 / l);
            this.reasons = reasons;
            return rval / (vrs(t) * l);
        };
        this.mkrval = function (r) {
            var rs = maa(5);
            for (var i = 0; i < 5; ++i) rs[i] = [i, reasons[i]];
            rs.sort(function (a, b) {
                if (a[1] < b[1]){ return 1; };
                if (a[1] > b[1]){ return -1; };
                return 0;
            });
            for (var i = 0; i < 5; ++i) rs[i] = rs[i][0];
            return {quality: r, reasons: rs};
        };
        function cc(t, i) {
            return t.charCodeAt(i);
        }
        function _cd(t, i) {
            return cc(t, i) - 97;
        }
        function avg(a) {
            var r = a.p;
            for (var i = 0; i < a.p.length; ++i) r[i] = (a.c[i] != 0 ? r[i] / a.c[i] : 1.5);
            return r;
        }
        function maa(l, f) {
            var a = [];
            for (var k = 0; k < l; k++) a.push(f === undefined ? 0 : f);
            return a;
        }
        function ma(l) {
            return {p: maa(l), c: maa(l)};
        }
        function suma(a, b) {
            var r = a;
            for (var i = 0; i < a.length; ++i) r[i] = a[i] + b[i];
            return r;
        }
        function sum(a, b) {
            return {p: suma(a.p, b.p), c: suma(a.c, b.c)};
        }
        function p(i, j, l, lf) {
            var c = i * 26 + j;
            var b = lf[l][~~(c / 16)];
            return ((b >> (30 - 2 * (c % 16))) & 3);
        }
        function se(i, t, ctx) {
            var c = _cd(t, i);
            var r = ma(ctx.lf.length);
            for (var j = i + 1, l = 0; j < t.length; ++j, ++l) {
                r.p[l] += p(c, _cd(t, j), l, ctx.lf);
                r.c[l]++;
                if (l == (ctx.lf.length - 1)) break;
            }
            return r;
        }
        function prep(t) {
            t = t.toLowerCase();
            return t.replace(/[^a-z]/g, '');
        }
        function clc(t, tbl) {
            t = prep(t);
            var r = ma(tbl.lf.length);
            if (t != '') {
                for (var i = 0; i < t.length; ++i) r = sum(r, se(i, t, tbl))
            }
            return r;
        }
        function cap(a) {
            return cc(a, 0) > 96;
        }
        function ctp(a) {
            var c = cc(a, 0);
            if ((c > 64 && c < 91) || (c > 96 && c < 123)) return 0;
            if (c > 47 && c < 58) return 1;
            return (c > 126 ? 3 : 2)
        }
        function vrq(a, b) {
            var t = ctp(a);
            if (t != ctp(b)) return 0.04;
            if (t == 0 && cap(a) != cap(b)) return 0.01;
            return 0;
        }
        function uni(a) {
            if (a.length <= 1) return a;
            var t = [a[0]], p = a[0];
            for (var i = 1; i < a.length; ++i) {
                if (a[i] != p) {
                    t.push(a[i]);
                    p = a[i];
                }
            }
            return t;
        }
        function dvrs(t) {
            if (t.length <= 1) return 1;
            var d = [], p = cc(t, 0);
            for (var i = 1; i < t.length; ++i) {
                var c = cc(t, i);
                d.push(c - p);
                p = c;
            }
            d.sort();
            var dsz = d.length;
            d = uni(d);
            if (d.length <= 2) return 0.5;
            if (d.length < dsz / 2) return (0.5 + d.length / dsz);
            return 1.1;
        }
        function ovrs(t) {
            if (t.length <= 1) return 1;
            var q = 1;
            var p = t.charAt(0);
            for (var i = 1; i < t.length; ++i) {
                q += vrq(p, t.charAt(i));
                p = t.charAt(i);
            }
            return q;
        }
        function vrs(t) {
            var d = dvrs(t);
            reasons[4] = 1 / d;
            var o = ovrs(t);
            reasons[3] = 1 / o;
            return Math.min(d, o);
        }
        function lk(t) {
            if (t.length <= 0) return 0.01;
            if (t.length >= 80) return Math.log(t.length);
            return Math.log(t.length) / Math.log(11 - (~~(t.length / 10)));
        }
    }
    function retv(v) {
        if (v <= 1) return 0;
        if (v <= 1.5) return 1;
        if (v <= 2) return 2;
        return 3;
    }
    function getPasswordStrength(value) {
        if (!checker) {
            checker = new KasPassCheck();
        }
        var val = retv(checker.calc(value));
        if (val == 3 || val == 2 || value.length >= 8) {
            return checker.mkrval(val);
        }
        checker.reasons[2] = 0;
        return checker.mkrval(2);
    }
    return {
        getPasswordStrength: getPasswordStrength
    };
})();
function NeedToShowBalloon(elem){
	if(!elem)return false;
	if(!elem.tagName||elem.tagName.toLowerCase()!="input")return false;
	if(!elem.type||elem.type.toLowerCase()!='password')return false;
	var inputs=document.getElementsByTagName('input');
	var p=-1,pp=-1,f=false;
	function p_near(i,j){
		function r(x){return Math.round(x);}
		function bnd(e){return e.getBoundingClientRect();}
		function hid(p){if (p&&(((p.right-p.left)==0)||((p.top-p.bottom)==0)))return true;return false;}
		function abs(a){return Math.abs(a);}
		var r1=bnd(inputs[i]);
		var r2=bnd(inputs[j]);
		if (hid(r1))return false;
		if (hid(r2))return false;
		var dx=abs(r(r2.left-r1.left));
		var dy=abs(r(r2.top-r1.top));
		var dxw=abs(r(r2.left-r1.right));
		var dyh=abs(r(r2.top-r1.bottom));
		var n=10,m=130;
		if(dy<=n&&dxw<=m)return true;
		if(dy<=m&&dxw<=n)return true;
		if(dx<=n&&dyh<=m)return true;
		if(dx<=m&&dyh<=n)return true;
		return false;
	};
	function in_double_set(i,j)
	{
		if(elem==inputs[i]||elem==inputs[j])return true;
		return false;
	}
	function check_double()
	{
		if(f)
		{
			if(p>=0&&pp>=0&&in_double_set(p,pp))return true;
			f=false;
		}
		p=-1;pp=-1;
		return false;
	}
	for(var i=0;i<inputs.length;++i){
		if(inputs[i].type.toLowerCase()=="password"){
			if (p>=0){
				if(p_near(p,i)){
					if(pp>=0){
						if(in_double_set(i,p))return true;
						p=-1;pp=-1;
					}else{
						if((i==inputs.length-1)&&(in_double_set(i,p)))return true;
						f=true;
					}
				}else{
					if(check_double())return true;
				}
				pp=p;
			}
			p=i;
		}else{
			if(check_double())return true;
		}
	}
	return false;
}
ns.CheckPasswordStrength = PasswordStrengthChecker.getPasswordStrength;
ns.NeedToShowBalloon = NeedToShowBalloon;
}) (KasperskyLab || {});
(function (ns) 
{
ns.waitForApiInjection = function(isApiInjected, eventName, callback)
{
    if (isApiInjected())
    {
        callback();
        return;
    }
    var subscription = createSubscription(eventName, onApiInjected)
    function onApiInjected()
    {
        if (isApiInjected())
        {
            subscription.unsubscribe();
            callback();
        }
    }
}
function createSubscription(eventName, callback)
{
    var windowEventsSupported = document.createEvent || window.addEventListener;
    return new (windowEventsSupported ? ModernSubscription : IeLegacySubscription)(eventName, callback);
}
function ModernSubscription(eventName, callback)
{
    ns.AddRemovableEventListener(window, eventName, callback);
    this.unsubscribe = function()
    {
        ns.RemoveEventListener(window, eventName, callback);
    }
}
function IeLegacySubscription(eventName, callback)
{
    ns.AddRemovableEventListener(document.documentElement, 'propertychange', onPropertyChange);
    this.unsubscribe = function()
    {
        ns.RemoveEventListener(document.documentElement, 'propertychange', onPropertyChange);
    }
    function onPropertyChange(event)
    {
        if (event.propertyName == eventName)
            callback();
    }
}
})(KasperskyLab || {});
var tabIdPropertyName = KasperskyLab.LIGHT_PLUGIN_API_KEY || 'klTabId_kis';
var scriptPluginId = Math.floor((1 + Math.random()) * 0x10000).toString(16);
function isApiInjected()
{
    return !!window[tabIdPropertyName];
}
function removeTabIdProperty()
{
	try {
		delete window[tabIdPropertyName];
	} catch (e) {
		window[tabIdPropertyName] = undefined;
	}	
}
var documentInitParameters = isApiInjected() ? {tabId: String(window[tabIdPropertyName]), scriptPluginId: scriptPluginId} : null;
KasperskyLab.AddRunner("light_doc", function (ns, session)
{
session.InitializePlugin(function(activatePlugin, _, callFunction)
{
	activatePlugin('light_doc');
	if (documentInitParameters)
	{
		removeTabIdProperty();
		return;
	}
	ns.waitForApiInjection(isApiInjected, tabIdPropertyName, function()
	{
		var tabId = String(window[tabIdPropertyName]);
		removeTabIdProperty();
		callFunction("light_doc.registerDocument", { tabId : tabId, scriptPluginId: scriptPluginId });
	});	
});
}, documentInitParameters);
KasperskyLab.AddRunner("ca", function (ns, session) 
{
	var m_callFunction = function(){}, m_syncCallFunction;;
	var m_bodySended = false;
	var m_subscribedAttribute = "ca_" + ns.GetCurrentTime();
	var m_lastSendedTime = 0;
	var m_accountElements = [];
	var m_domParser = ns.GetDomParser(session);
	function ToBase64(value)
	{
		if (ns.IsDefined(window.btoa))
			return btoa(value);
		var Base64Alphabit = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var plain = value;
		var padLength = 0;
		if (plain.length % 3)
		{
			padLength = 3 - plain.length % 3;
			for (var i = 0; i < padLength; ++i)
				plain += '\0';
		}
		var result = "";
		for (var i = 0; i < plain.length; i += 3)
		{
			var byte1 = plain.charCodeAt(i);
			var byte2 = plain.charCodeAt(i + 1);
			var byte3 = plain.charCodeAt(i + 2);
			var temp = byte1 << 16 | byte2 << 8 | byte3;
			var sixBit1 = temp>>18 & 0x3f;
			var sixBit2 = temp>>12 & 0x3f;
			var sixBit3 = temp>>6 & 0x3f;
			var sixBit4 = temp & 0x3f;
			result += Base64Alphabit.charAt(sixBit1) + Base64Alphabit.charAt(sixBit2) + Base64Alphabit.charAt(sixBit3) + Base64Alphabit.charAt(sixBit4);
		}
		if (padLength > 0)
		{
			result = result.slice(0, result.length - padLength);
			for (var i = 0; i < padLength; ++i)
				result += "=";
		}
		return result;
	}
	function CallService(commandName, argObject, resultCallback)
	{
		m_callFunction("ca." + commandName, argObject, resultCallback, OnError);
	}
	function TrySyncCallService(commandName, argObject, resultCallback)
	{
		return m_syncCallFunction("ca." + commandName, argObject, resultCallback, OnError);						
	}
	function ProcessChilds(childNodes)
	{
		for (var i = 0; i < childNodes.length; ++i)
		{
			var element = childNodes[i];
			if (element.nodeType !== Node.ELEMENT_NODE)
				continue;
			if (!IsVisible(element))
				element.setAttribute("wfd-invisible", true);
			else
				ProcessChilds(element.childNodes);
		}
	}
	function OnKeyDown()
	{
		if (m_bodySended)
			return;
		try
		{
			ProcessChilds(document.body.childNodes);
		}
		catch (e)
		{
			ns.SessionLog(e);
		}
		m_bodySended = true;
		m_domParser.GetLoginSelectors(OnInputCallback);
	}
	function GetElements(root, tag, type)
	{
		if (root.querySelectorAll)
			return root.querySelectorAll(tag + "[type='"+type+"']");
		var result = [];
		var childrens = root.getElementsByTagName(tag);
		for (var i = 0; i < childrens.length; i++) 
		{
			if (childrens[i].type.toLowerCase() == type) 
				result.push(childrens[i]);
		}
		return result;
	}
	function IsVisible(element) 
	{
		var style = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle;
		return style.display !== "none";
	}
	function GetSingleButton()
	{
		var buttons = GetElements(document, 'button', 'submit'); 
		if (buttons && buttons.length > 0) 
			return buttons;
		buttons = document.getElementsByTagName("button");
		if (buttons && buttons.length === 1) 
			return buttons[0];
		var result = [];
		for (var i = 0; i < buttons.length; i++) 
			if (IsVisible(buttons[i])) 
				result.push(buttons[i]);
		return result.length === 1 ? result[0] : [];
	}
	function IsSubscribedElement(element)
	{
		return element[m_subscribedAttribute];
	}
	function SetSubscribedElement(element)
	{
		element[m_subscribedAttribute] = true;
	}
	function OnInputCallback(result, onInputData)
	{
		if (result != 0)
			return;
		for (var i = 0; i < onInputData.length; ++i)
		{
			var accountElement = document.querySelector(onInputData[i]);
			if (!accountElement)
			{
			    session.Log("Couldn't find element for selector " + onInputData[i]);
			    continue;
			}
			SetEventHandlers(accountElement);
			m_accountElements.push(accountElement);
		}
	}
	function OnSubmit()
	{
	    session.Log("=> OnSubmit");
		var currentTime = ns.GetCurrentTime();
		if (currentTime - 500 < m_lastSendedTime)
		{
			session.Log('skipping OnSubmit due to timing');
			return; 
		}
		var accounts = [];
		for (var i = 0; i < m_accountElements.length; ++i)
		{
			var accountElement = m_accountElements[i];
			if (accountElement.value)
				accounts.push(ToBase64(accountElement.value));
		};
		if (accounts.length > 0)
		{
			if(!TrySyncCallService("onAccount", {accounts:accounts}))
			{
				CallService("onAccount", {accounts:accounts});
			}			
			m_lastSendedTime = currentTime;
		}
		else
		{
			ns.SessionLog("CA: OnSubmit with no data occure");
		}
		session.Log("<= OnSubmit");
	}
	function SetEnterKeyEventListener(element)
	{
		ns.AddEventListener(element, "keydown", 
			function(e)
			{
				if (e.keyCode === 13)
					OnSubmit(); 
			});
	}
	function SetButtonClickEventListener(element)
	{
		ns.AddEventListener(element, "click", OnSubmit);
	}
	function SetButtonsEventHandlers(submitButtons)
	{
		for (var i = 0; i < submitButtons.length; ++i)
		{
			var button = submitButtons[i];
			if (!IsSubscribedElement(button))
			{
				SetButtonClickEventListener(button);
				SetEnterKeyEventListener(button);
				SetSubscribedElement(button);
			}
		}
	}
	function SetEventHandlers(accountElement)
	{
		if (IsSubscribedElement(accountElement))
			return;
		session.Log("setting Enter Key event handlers for " + accountElement.id);
		SetEnterKeyEventListener(accountElement);
		if (accountElement.form)
		{
			var parentForm = accountElement.form;
			if (!IsSubscribedElement(parentForm))
			{
			    session.Log("setting form submit event handlers for " + accountElement.id);
				ns.AddEventListener(accountElement.form, "submit", OnSubmit);
				SetSubscribedElement(parentForm);
			}
			session.Log("setting button click event handlers for " + accountElement.id);
			SetButtonsEventHandlers(GetElements(parentForm, "input", "submit"))
		}
		else
		{
		    session.Log("setting button click event handlers for " + accountElement.id);
			SetButtonsEventHandlers(GetSingleButton());
		}
	}
	function OnError(e) {
		session.Log("ERR CA - " + (e.message || e));
	}
	function OnPing() 
	{
		return ns.MaxRequestDelay;
	}
	function OnInitializeCallback(activatePlugin, registerMethod, callFunction,  deactivate, syncCall)
	{
		m_callFunction = callFunction;
		m_syncCallFunction = syncCall;
		activatePlugin('ca', OnPing, OnError);
		ns.AddEventListener(document, "keydown", OnKeyDown);
	}
	function InitializePlugin()
	{
		session.InitializePlugin(OnInitializeCallback);
	}
	InitializePlugin();
});
(function (ns) {
ns.UrlAdvisorBalloon = function (session, locales)
{
	var m_balloon = new ns.Balloon2("ua", "/ua/url_advisor_balloon.html", "/ua/balloon.css", session, GetCoordsCallback, OnCloseHandler, locales, OnDataReceiveHandler);
	var m_currentVerdict = null;
	var m_balloonElement = null;
	var m_markerDiv = null;
	var m_tagDiv = null;
	var m_mouseX = 0;
	var m_mouseY = 0;
	var ratingIds = [
		{className:"green", headerNode:locales["UrlAdvisorBalloonHeaderGood"], textNode : locales["UrlAdvisorSetLocalContentOnlineGood"]},
		{className:"grey", headerNode:locales["UrlAdvisorBalloonHeaderSuspicious"], textNode:locales["UrlAdvisorSetLocalContentOnlineSuspicious"]},
		{className:"red", headerNode:locales["UrlAdvisorBalloonHeaderDanger"], textNode:locales["UrlAdvisorSetLocalContentOnlineDanger"]},
		{className:"yellow", headerNode:locales["UrlAdvisorBalloonHeaderWmuf"], textNode : locales["UrlAdvisorSetLocalContentOnlineWmuf"]}
	];
	function GetCoordsCallback(balloonSize)
	{
		return GetCoord(balloonSize, m_mouseX, m_mouseY)
	}
	function OnCloseHandler(arg)
	{
		if(arg == 0)
		{
			m_balloon.Hide();
		}
	}
	function OnDataReceiveHandler()
	{
	}
	function GetCoord(balloonSize, clientX, clientY)
	{
		var coord = {x: 0, y: 0};
		var clientWidth = ns.GetPageWidth();
		var halfWidth = balloonSize.width / 2;
		if (halfWidth > clientX)
			coord.x = 0;
		else if (halfWidth + clientX > clientWidth)
			coord.x = clientWidth - balloonSize.width;
		else
			coord.x = clientX - halfWidth;
		var clientHeight = ns.GetPageHeight();
		coord.y = (clientY + balloonSize.height > clientHeight) ? clientY - balloonSize.height : clientY;
		if (coord.y < 0)
			coord.y = 0;
		var scroll = ns.GetPageScroll();
		coord.y += scroll.top;
		coord.x += scroll.left;
		return coord;
	}
	this.HideBalloon = function()
	{
		m_balloon.Hide();
	}
	this.ShowBalloon = function(clientX, clientY, verdict)
	{
		m_mouseX = clientX;
		m_mouseY = clientY;
		m_currentVerdict = verdict;
		m_balloon.Show(ratingIds[m_currentVerdict.rating - 1].className + " " + ns.md5(verdict.url), { verdict: m_currentVerdict, locales: locales });
	}
};
}) (KasperskyLab || {});
var CheckedAtributeName = 'kl_' + KasperskyLab.GetCurrentTime();
var IconName = 'kl_' + KasperskyLab.GetCurrentTime();
KasperskyLab.AddRunner("ua", function (ns, session, settings, locales) {
var UrlAdvisor = function()
{
	var m_urlAdvisorBalloon = new ns.UrlAdvisorBalloon(session, locales);
	var m_enabled = settings.enable;
	var m_checkOnlySearchResults = settings.mode;
	var m_linkSelector = settings.linkSelector;
	var m_elementAfterSelector = settings.elementAfterSelector;
	var m_postponeCategorizeStarted = false;
	var m_urlCategorizeRequestTime = 0;
	var m_observer;
	var m_callFunction = function(){};
	var m_categorizingObjects = {};
	var m_clearCategorizingObjectsTimerId;
	function AddToCategorizeList(url, linkElement)
	{
		if (url in m_categorizingObjects)
		{
			m_categorizingObjects[url].push(linkElement);
		}
		else
		{
			m_categorizingObjects[url] = [linkElement];
		}
	}
	session.InitializePlugin(function(activatePlugin, registerMethod, callFunction){
		m_callFunction = callFunction;
		activatePlugin('ua', OnPing, OnError);
		registerMethod('ua.verdict', SetVerdictDelayed);
		registerMethod('ua.settings', SetSettings);
	});
	function FillSelectors()
	{
	    if (m_linkSelector)
	        return;
	    try
	    {
	        var currentPageUrl = document.location.href;
	        var schemeEndPos = currentPageUrl.indexOf("://");
	        if (schemeEndPos !== -1)
	        {
	            var host = currentPageUrl.substr(schemeEndPos + 3).toLowerCase();
	            if (host.indexOf("www.google.") === 0) {
	                m_linkSelector = "div.r > a:first-child, h3.r > a:first-child";
	                m_elementAfterSelector = "h3.LC20lb";
	            }
	            else if (host.indexOf("yandex.") === 0 || host.indexOf("www.yandex.") === 0) {
	                m_linkSelector = "h2 > a.organic__url, h2 > a.serp-item__title-link, h2 > a.b-serp-item__title-link";
	            }
	            else if (host.indexOf("search.yahoo.com") === 0) {
	                m_linkSelector = "a.ac-21th";
	            }
	            else if (host.indexOf("search.yahoo.co.") === 0) {
	                m_linkSelector = ".hd > h3 > a";
	            }
	            else if (host.indexOf("search.yahoo.com") !== -1) {
	                m_linkSelector = "a.ac-21th, a.td-u";
	            }
	            else if (host.indexOf("www.bing.com") === 0) {
	                m_linkSelector  = ".b_algo > h2 > a, .sb_tlst > h2 > a, .b_algo > .b_title > h2 > a";
	            }
	            else if (host.indexOf("go.mail.ru") === 0) {
	                m_linkSelector = ".res-head > a[target=\"_blank\"], .result__title > a[target=\"_blank\"]";
	            }
	            else if (host.indexOf("nova.rambler.ru") === 0) {
	                m_linkSelector = "a.Serp__item__link--3g7Km, a.b-serp-item__link";
	            }
	            else if (host.indexOf("www.baidu.com") === 0) {
	                m_linkSelector = "h3.t > a";
	            }
	            else if (host.indexOf("www.baidu.jp") === 0) {
	                m_linkSelector = ".web h3 > a";
	            }
	            else if (host.indexOf("www.ask.com") === 0) {
	                m_linkSelector = "a.PartialSearchResults-item-title-link.result-link";
	            }
	        }
	    }
	    catch (e) {     
	    }
	}
	FillSelectors();
    Run();
	function OnPing(currentTime)
	{
		var timeFormRequest = (currentTime >= m_urlCategorizeRequestTime) ? currentTime - m_urlCategorizeRequestTime : 0;
		return timeFormRequest <= 10000 ? 500 : ns.MaxRequestDelay;
	}
	function OnError(e) {
	    session.Log('ERR UA - ' + (e.message || e));
	}
	function GetHref(link)
	{
		try	{ return link.href;	} catch(e){}
		try	{ return link.getAttribute('href');	} catch(e){}
		return '';
	}
    function CreateIcon() {
        var icon = document.createElement("img");
        icon.name = IconName;
        icon.width = 16;
        icon.height = 16;
        icon.style.width = "16px";
        icon.style.height = "16px";
        icon.onclick = function (evt) { ns.StopProcessingEvent(evt); };
        return icon;
    }
    function GetLinkIcon(linkElement)
    {
        var nextElement = linkElement.nextSibling;
        if (m_elementAfterSelector)
        {
            nextElement = linkElement.querySelector(m_elementAfterSelector);
            if (nextElement)
                nextElement = nextElement.nextSibling;
            else
                nextElement = linkElement.nextSibling;
        }
        return (nextElement !== null && nextElement.name == IconName) ? nextElement : undefined;
    }
	function GetOrCreateLinkIcon(linkElement)
    {
        var icon = GetLinkIcon(linkElement);
        if (icon)
            return icon;
        var nextElement = linkElement;
        if (m_elementAfterSelector)
        {
            nextElement = linkElement.querySelector(m_elementAfterSelector);
            if (!nextElement)
                nextElement = linkElement;
        }
        nextElement.parentNode.insertBefore(CreateIcon(), nextElement.nextSibling);
        return nextElement.nextSibling;
	}
    function GetLinkElementByIcon(icon)
	{
        if (!m_elementAfterSelector)
            return icon.previousSibling;
        var searchLinks = document.querySelectorAll(m_linkSelector);
        for (var i = 0; i < searchLinks.length; i++)
        {
            var elem = searchLinks[i].querySelector(m_elementAfterSelector);
            if (searchLinks[i].nextSibling === icon || (elem && elem.nextSibling === icon))
                return searchLinks[i];
        }
        return icon.previousSibling;
    }
	function UpdateIconImage(icon, verdict)
	{
		if (verdict.rating === 1)
		{
			icon.src = locales["UrlAdvisorGoodImage.png"];
			icon['kis_status'] = 16;
		}
		else if (verdict.rating === 2)
		{
			icon.src = locales["UrlAdvisorSuspiciousImage.png"];
			icon['kis_status'] = 8;
		}
		else if (verdict.rating === 3)
		{
			icon.src = locales["UrlAdvisorDangerImage.png"];
			icon['kis_status'] = 4;
		}
		else if (verdict.rating === 4)
		{
			icon.src = locales["UrlAdvisorwmufImage.png"];
		}
	}
	function SubscribeIconOnMouseEvents(icon, verdict)
	{
		var balloonTimerId = 0;
		ns.AddEventListener(icon, "mouseout", 
			function()
			{
				if (balloonTimerId)
				{
					clearTimeout(balloonTimerId);
					balloonTimerId = 0;
				}
			});
		ns.AddEventListener(icon, "mouseover", 
			function(args)
			{
				if (!balloonTimerId)
				{
					var clientX = args.clientX;
					var clientY = args.clientY;
					balloonTimerId = ns.SetTimeout(function()
						{
							m_urlAdvisorBalloon.ShowBalloon(clientX, clientY, verdict);
							balloonTimerId = 0;
						}, 300);
				}
			});
	}
	function IsElementEmpty(linkElement)
	{
	    return !linkElement.offsetHeight && !linkElement.offsetWidth
            && !linkElement.outerText && !linkElement.text;
	}
	function SetVerdictForUrl(verdict)
	{
		try
		{
			if (!(verdict.url in m_categorizingObjects))
				return;
			var linkElements = m_categorizingObjects[verdict.url];
			for (var linkIndex = 0; linkIndex < linkElements.length; ++linkIndex)
			{
				if (IsElementEmpty(linkElements[linkIndex]))
					continue;
				var icon = GetOrCreateLinkIcon(linkElements[linkIndex]);
				if (!icon)
					continue;
				UpdateIconImage(icon, verdict);
				SubscribeIconOnMouseEvents(icon, verdict);
			}
		}
		catch (e)
		{
			session.Log('set verdict exception: ' + (e.message || e));
		}
		delete m_categorizingObjects[verdict.url];
	}
	function SetVerdict(argument)
	{
		for (var currentVerdict = 0; currentVerdict < argument.verdicts.length; currentVerdict++)
			SetVerdictForUrl(argument.verdicts[currentVerdict]);
	}
	function SetVerdictDelayed(argument)
	{
		ns.SetTimeout(function(){SetVerdict(argument);}, 1000);
	}
	function SetSettingsImpl(argument)
	{
		m_enabled = argument.enable;
		if (!m_enabled)
			return;
		m_checkOnlySearchResults = argument.mode;
	}
	function ClearImages()
	{
		var images = document.getElementsByName(IconName);
		while (images.length > 0)
			images[0].parentNode.removeChild(images[0]);
	}
	function ClearAttributes()
	{
		for (var i = 0; i < document.links.length; ++i)
			if (document.links[i][CheckedAtributeName])
				document.links[i][CheckedAtributeName] = false;
	}
	function SetSettings(argument)
	{
		ClearImages();
		ClearAttributes();
		SetSettingsImpl(argument);
		CategorizeUrl();
	}
	function IsNeedCategorizeLink(linkElement)
	{
		try
		{
		    return !linkElement.isContentEditable && !!linkElement.parentNode 
                && !GetLinkIcon(linkElement) && !linkElement[CheckedAtributeName]
				&& !IsElementEmpty(linkElement);
		}
		catch(e)
		{
			session.Log('check link exception: ' + (e.message || e));
			return false;
		}
	}
	function ProcessDomChange()
	{
		try
		{
			if (!m_postponeCategorizeStarted)
			{
				ns.SetTimeout(CategorizeUrl, 500);
				m_postponeCategorizeStarted = true;
			}
			var images = document.getElementsByName(IconName);
			for (var i = 0; i < images.length; ++i)
			{
			    var linkNode = GetLinkElementByIcon(images[i]);
				if (!linkNode || !linkNode.nodeName || linkNode.nodeName.toLowerCase() !== "a")
				{
					var imageNode = images[i];
					imageNode.parentNode.removeChild(imageNode);
				}
			}
		}
		catch (e)
		{
			session.Log("ua dom change handling exception: " + (e.message || e));
		}
	}
	function CategorizeUrl()
	{
		try
		{
			if (!m_enabled)
			{
				session.Log("skip categorize links because UA disabled");
				return;
			}
			m_postponeCategorizeStarted = false;
			var linksForCategorize = [];
			var linksForCheck = m_linkSelector && m_checkOnlySearchResults ? document.querySelectorAll(m_linkSelector) : document.links;
			for (var i = 0; i < linksForCheck.length; i++)
			{
			    var link = linksForCheck[i];
				if (IsNeedCategorizeLink(link))
				{
					link[CheckedAtributeName] = true; 
					var href = GetHref(link);
					if (!!href) {
						linksForCategorize.push(href); 
						AddToCategorizeList(href, link);
					} else {
						ns.Log("access to href blocked by browser"); 
					}
				}
			}
			if (linksForCategorize.length)
			{
				m_callFunction("ua.categorize", {links: linksForCategorize}, null, OnError);
				m_urlCategorizeRequestTime = ns.GetCurrentTime();
				clearTimeout(m_clearCategorizingObjectsTimerId);
				m_clearCategorizingObjectsTimerId = ns.SetTimeout(function () {
					m_categorizingObjects = {};
				}, 1000 * 60 * 5);
			}
			else
			{
				session.Log("UA not found links for categorization");
			}
		}
		catch (e)
		{
			session.Log("ua categorize exception: " + (e.message || e));
		}
	}
	function Run()
	{
		CategorizeUrl();
		m_observer = ns.GetDomChangeObserver("a");
		m_observer.Start(ProcessDomChange);
		ns.AddEventListener(window, "load", CategorizeUrl);
		ns.AddEventListener(window, "unload",
			function()
			{
				if (m_observer)
					m_observer.Stop();
			});
	};
};
var instance = null;
ns.RunModule(function()
{
	try
	{
		if (!instance) {
			instance = new UrlAdvisor();
		}
	}
	catch(e)
	{
		session.Log('UrlAdvisor exception ' + (e.message || e));
	}
});
});
KasperskyLab.AddRunner("wsm", function (ns, session)
{
	if (window != window.top)
		return;
	var m_callFunction = null;
	var m_activatedState = 0;
	var m_activatedStateChangeTimeout;
	var m_documentTitleIsAvailable = false;
	var m_stateChangeDelayTimeout;
	function Initialize() {
		session.InitializePlugin(function(activatePlugin, registerMethod, callFunction) {
			m_callFunction = callFunction;
			activatePlugin("wsm", OnPing, OnError);
		});
	}
	function OnPing() {
		return ns.MaxRequestDelay;
	}
	function OnError(e) {
		session.Log("ERR WSM - " + (e.message || e));
	}
	function FireActivateEventImpl() {
	    m_callFunction("wsm.sessionActivated", { title: document.title}, function () {
	        if (m_activatedState === 3)
	            ProcessDeactivate();
	        m_activatedState = 2;
	    }, OnError);
	    m_activatedState = 1;
	}
	function FireDeactivateEventImpl() {
	    m_callFunction("wsm.sessionDeactivated", {title: document.title}, function () {
	        if (m_activatedState === 1)
	            ProcessActivate();
	        m_activatedState = 0;
	    }, OnError);
	    m_activatedState = 3;
	}
	function FireActivateEvent()
	{
		clearTimeout(m_stateChangeDelayTimeout);
		if (m_documentTitleIsAvailable || document.title)
		{
			m_documentTitleIsAvailable = true;
			FireActivateEventImpl();
		}
		else
		{
			m_stateChangeDelayTimeout = ns.SetTimeout(function()
				{
					m_documentTitleIsAvailable = true;
					ProcessActivate();
				}, 500);
		}
	}
	function FireDeactivateEvent()
	{
		if (m_documentTitleIsAvailable)
			FireDeactivateEventImpl();
		else
			clearTimeout(m_stateChangeDelayTimeout);
	}
	function ProcessActivate()
	{
		clearTimeout(m_activatedStateChangeTimeout);
		m_activatedStateChangeTimeout = ns.SetTimeout(function()
			{
				if (m_activatedState === 0)
					FireActivateEvent();
				else if (m_activatedState === 3)
					m_activatedState = 1;
			}, 0);
	}
	function ProcessDeactivate()
	{
		clearTimeout(m_activatedStateChangeTimeout);
		m_activatedStateChangeTimeout = ns.SetTimeout(function()
			{
				if (m_activatedState === 2)
					FireDeactivateEvent();
				else if (m_activatedState === 1)
					m_activatedState = 3
			}, 0);
	}
	function OnFocus() {
		if (m_callFunction)
			ProcessActivate();
	}
	function OnBlur() {
		if (m_callFunction && !document.hasFocus())
			ProcessDeactivate();
	}
	Initialize();
	if (document.hasFocus())
	{
		FireActivateEvent();
		ns.AddEventListener(window, "load", 
			function()
			{
				if (!document.hasFocus())
					ProcessDeactivate();
			});
	}
	if (window.addEventListener)
	{
		ns.AddEventListener(window, "focus", OnFocus);
		ns.AddEventListener(window, "blur", OnBlur);
	}
	else
	{
		ns.AddEventListener(document, "focusin", OnFocus);
		ns.AddEventListener(document, "focusout", OnBlur);
	}
	ns.AddEventListener(window, "beforeunload", function()
		{
			clearTimeout(m_activatedStateChangeTimeout);
			m_activatedStateChangeTimeout = null;
			m_callFunction = null;
		});
}, { referrer: document.referrer });
(function (ns)
{
ns.IsPositionEqual = function(prevPos, currentPos)
{
	return prevPos && currentPos && prevPos.top === currentPos.top && prevPos.left === currentPos.left;
};
ns.GetAbsoluteElementPosition = function(element)
{
	var box = element.getBoundingClientRect();
	var scroll = ns.GetPageScroll();
	return {
			left: box.left + scroll.left,
			top: box.top + scroll.top,
			right: box.right + scroll.left,
			bottom: box.bottom + scroll.top
		};
};
})(KasperskyLab || {});
(function (ns) 
{
ns.ProtectableElementDetector = function(protectMode)
{
	var m_typesForbidden = ['hidden', 'submit', 'radio', 'checkbox', 'button', 'image'];
	var m_protectMode = protectMode;
	this.Test = function(element)
	{
		if (m_protectMode < 2 || m_protectMode > 3)
			return false;
		var elementType = element.getAttribute('type');
		elementType = elementType && elementType.toLowerCase();
		if (m_protectMode === 2)
		{
			if (elementType != 'password')
				return false;
		}
		else if (Includes(m_typesForbidden, elementType))
		{
			return false;
		}
		if (GetComputedStyle(element, 'display') === 'none')
			return false;
		var maxLength = parseInt(element.getAttribute('maxlength'), 10);
		return typeof maxLength === 'number' && maxLength <= 3 ? false : !element.readOnly;
	};
	function Includes(list, text)
	{
		var i = 0, count = list.length;
		for (; i < count; ++i)
		    if (list[i] === text)
				return true;
		return false;
	}
	function GetComputedStyle(element, property)
	{
		var value;
		if (element.currentStyle)
		{
			value = element.currentStyle[property];
		}
		else
		{
			var styles = window.getComputedStyle(element, '');
			if (styles)
				value = styles.getPropertyValue(property);
		}
		return typeof value !== 'string' ? '' : value.toLowerCase();
	}
}
})(KasperskyLab || {});
(function (ns)
{
ns.SecureInputTooltip = function(locales, session)
{
	var m_balloon = new ns.Balloon2("vk_si", "/vk/secure_input_tooltip.html", "/vk/secure_input_tooltip.css", session, GetCoords, OnCloseHandler, locales);
	var m_currentElement = null;
	var m_timer;
	var that = this;
	var Top = 0;
	var Bottom = 1;
	var m_lastTooltipPosition = Bottom;
	function GetClassName(position)
	{
		if (position === Top)
			return "top_balloon";
		else if (position === Bottom)
			return "bottom_balloon";
		else 
			return null;
	}
	function UpdateBalloon()
	{
		if (!m_balloon)
			return;
		m_balloon.Update(GetClassName(m_lastTooltipPosition));
	}
	function SetPosition(position)
	{
		if (m_lastTooltipPosition === position)
			return;
		m_lastTooltipPosition = position;
		UpdateBalloon();
	}
	function GetCoords(tooltipSize)
	{
		if (!m_timer)
		{
			m_timer = ns.SetInterval(UpdateBalloonByTimer, 100);
			ns.SetTimeout(function () { that.Hide(); }, 3000);
		}
		var inputPosition = ns.GetAbsoluteElementPosition(m_currentElement);
		var coords = {x: inputPosition.left, y: inputPosition.top};
		var inputTopRelative = inputPosition.top - ns.GetPageScroll().top;
		var clientHeightUnderInput = ns.GetPageHeight() - inputTopRelative - m_currentElement.offsetHeight;
		if ((clientHeightUnderInput > tooltipSize.height - 1) || 
			(inputPosition.top - tooltipSize.height + 1 < 0))
		{
			coords.y = inputPosition.top + m_currentElement.offsetHeight - 1;
			SetPosition(Top);
		}
		else
		{
			coords.y = inputPosition.top - tooltipSize.height + 1;
			SetPosition(Bottom);
		}
		return coords;
	}
	function UpdateBalloonByTimer()
	{
		if (!m_balloon)
			return;
		m_balloon.UpdatePosition();
	}
	function RestoreFocusForLastElement()
	{
		if (m_currentElement) 
			m_currentElement.focus();
	}
	function OnCloseHandler(closeAction)
	{
		switch(closeAction)
		{
		case 1:
			ns.SetTimeout(RestoreFocusForLastElement, 0);
			break;
		default:
			ns.SessionLog("Unknown close action " + closeAction);
			break;
		};
	}
	this.Show = function(element)
	{
		m_currentElement = element;
		m_balloon.Show();
		this.Hide = function()
		{
			clearInterval(m_timer);
			ns.SetTimeout(function(){m_balloon.Destroy();}, 200);
			this.Show = function(){};
			this.Hide = function(){};
		};
	};
	this.Hide = function(){};
};
})(KasperskyLab || {});
(function (ns)
{
ns.VirtualKeyboardInputIcon = function(clickCallback, session)
{
	var m_element;
	var m_positionTimer;
	var m_visible = false;
	var m_balloon = new ns.Balloon2("vk_icon", "/vk/virtual_keyboard_input_icon.html", "/vk/virtual_keyboard_icon.css", session, GetCoords, null, null, DataReceive);
	var m_iconHideTimer;
	function ControlIconDisplaying(e)
	{
		try
		{
			var eventArg = e || window.event;
			if (eventArg.keyCode === 9 || eventArg.keyCode === 16)
				return;
			if (m_element.value === "")
				ShowInternal();
			else
				HideInternal();
		}
		catch (e)
		{
			ns.SessionLog(e);
		}
	}
	function HideInternal()
	{
		if (!m_visible)
			return;
		clearInterval(m_positionTimer);
		m_balloon.Destroy();
		m_visible = false;
	}
	function ShowInternal()
	{
		if (m_visible)
			return;
		m_balloon.Show();
		m_balloon.UpdatePosition();	
		m_positionTimer = ns.SetInterval(UpdateIconByTimer, 100);
		m_visible = true;
	}
	function UpdateIconByTimer()
	{
		m_balloon.UpdatePosition();
	}
	function DataReceive(data)
	{
	    if (data.showKeyboard && m_element)
	        clickCallback();
	}
	function GetCoords(tooltipSize)
	{
		var inputPosition = ns.GetAbsoluteElementPosition(m_element);
		var coords = {x: inputPosition.left + m_element.offsetWidth - 20, y: inputPosition.top + (m_element.offsetHeight - 16) / 2};
		return coords;
	}	
	this.Show = function(element)
	{
		m_element = element;
		clearTimeout(m_iconHideTimer);
		ShowInternal();
		ns.AddRemovableEventListener(m_element, "keyup", ControlIconDisplaying)
		this.Hide = function()
		{
			m_iconHideTimer = ns.SetTimeout(function(){HideInternal();}, 500);
			this.Hide = function(){};
			ns.RemoveEventListener(m_element, "keyup", ControlIconDisplaying);
		};
	};
	this.Hide = function(){};
};
})(KasperskyLab || {});
KasperskyLab.AddRunner("vk", function (ns, session, settings, locales)
{
var VirtualKeyboard = function()
{
	var m_callFunction, m_syncCallFunction;
	var m_virtualKeyboardIconShowMode = 0;
	var m_secureInputProtectMode = 0;
	var m_activeElement = null;
	var m_lastFocusedElement = null;
	var m_protectedState = 0;
	var m_enabledSecureInput = false;
	var m_protectChangeTimeout;
	var m_protectableVirtualKeyboardChecker = new ns.ProtectableElementDetector(settings.vkProtectMode);
	var m_protectableSecureInputChecker = null;
	var m_protectableVirtualKeyboardIconChecker = null;
	var m_attributeName = "vk_" + Math.floor((1 + Math.random()) * 0x10000).toString(16);
	var m_protectedText = null;
	function ShowVirtualKeyboard()
	{
		if (m_lastFocusedElement)
			m_lastFocusedElement.focus();
		m_callFunction("vk.showKeyboard");
	}
	var m_tooltip = new ns.SecureInputTooltip(locales, session);
	var m_icon = new ns.VirtualKeyboardInputIcon(ShowVirtualKeyboard, session);
	var m_postponeStart;
	var m_shutdown = false;
	session.InitializePlugin(function (activatePlugin, registerMethod, callFunction, deactivatePlugin, syncCallFunction) {
		m_callFunction = callFunction;
		m_syncCallFunction = syncCallFunction;
		activatePlugin('vk', OnPing);
		registerMethod('vk.settings', SetSettings);
		registerMethod('vk.keyDown', KeyDown);
		registerMethod('vk.keyUp', KeyUp);
		ns.AddEventListener(document, 'keyup', OnDocumentKeyUp);
	});
	function OnPing()
	{
		return (m_protectedState == 1 || m_protectedState == 2) ? 500 : ns.MaxRequestDelay;
	}
	function SetSettings(argument)
	{
		SetSettingsImpl(argument.virtualKeyboardIconShowMode, argument.secureInputProtectMode);
	}
	function SetSettingsImpl(newVirtualKeyboardIconShowMode, newSecureInputProtectMode)
	{
		if (newSecureInputProtectMode != m_secureInputProtectMode)
			m_protectableSecureInputChecker = new ns.ProtectableElementDetector(newSecureInputProtectMode);
		if (newVirtualKeyboardIconShowMode != m_virtualKeyboardIconShowMode)
			m_protectableVirtualKeyboardIconChecker = new ns.ProtectableElementDetector(newVirtualKeyboardIconShowMode);
		var needToUpdate = (newSecureInputProtectMode > m_secureInputProtectMode ||
			newVirtualKeyboardIconShowMode > m_virtualKeyboardIconShowMode);
		m_secureInputProtectMode = newSecureInputProtectMode;
		m_virtualKeyboardIconShowMode = newVirtualKeyboardIconShowMode;
		if (needToUpdate && m_observer)
			m_observer.settingsChanged();
	}
	function InsertCharacter(character)
	{
		var start = m_activeElement.selectionStart;
		var end = m_activeElement.selectionEnd;
		m_activeElement.value = m_activeElement.value.substring(0, start) + character + m_activeElement.value.substring(end);
		m_activeElement.setSelectionRange(start + character.length, start + character.length);
		m_protectedText = m_activeElement.value;
	}
	function GenerateKeyboardEvent(eventName, key, scanCodeValue, virtualCode, shiftKey)
	{
		var keyboardEvent = new KeyboardEvent(eventName, {'key':key, 'keyCode':virtualCode, 'code':scanCodeValue, 'bubbles':true, 'shiftKey':shiftKey});
		m_activeElement.dispatchEvent(keyboardEvent);
	}
	function GenerateInputEvent(eventName, data)
	{
		var inputEvent = new InputEvent(eventName, {'data': data, 'bubbles': true, 'inputType': 'insertText'});
		m_activeElement.dispatchEvent(inputEvent);
	}
	function GenerateChangeEvent()
	{
		m_protectedText = null;
		var changeEvent = new Event('change', {'bubbles' : true})
		m_activeElement.dispatchEvent(changeEvent);
	}
	function KeyDown(keyInfo)
	{
		if (!m_activeElement)
			return;
		var key = (keyInfo.isDeadKey) ? 'Dead' : String.fromCharCode(keyInfo.symbols[0]);
		GenerateKeyboardEvent('keydown', key, keyInfo.scanCodeValue, keyInfo.virtualCode, keyInfo.shift);
		for (var symbolIndex = 0; symbolIndex < keyInfo.symbols.length; ++symbolIndex)
		{
			var character = String.fromCharCode(keyInfo.symbols[symbolIndex]);
			GenerateKeyboardEvent('keypress', character, keyInfo.scanCodeValue, keyInfo.symbols[symbolIndex], keyInfo.shift);
			GenerateInputEvent('beforeinput', character);
			InsertCharacter(character);
			GenerateInputEvent('input', character);
		}
	}
	function KeyUp(keyInfo)
	{
		if (!m_activeElement)
			return;
		var key = (keyInfo.isDeadKey) ? 'Dead' : String.fromCharCode(keyInfo.symbols[0]);
		GenerateKeyboardEvent(m_activeElement, 'keyup', key, keyInfo.scanCodeValue, keyInfo.virtualCode, keyInfo.shift);
	}
	function OnDocumentKeyUp(event)
	{
		if (m_activeElement == event.target && event.keyCode == 13 && m_protectedText === m_activeElement.value)
			GenerateChangeEvent();
	}
	function NeedProtectElement(element)
	{
		return m_protectableSecureInputChecker.Test(element) || m_protectableVirtualKeyboardChecker.Test(element);
	}
	function HandleStartProtectCallback(result, args, needSecureInputCall)
	{
		if (m_protectedState === 3)	
		{
			if (result === 0)
				StopProtect();
			else
				m_protectedState = 0;	
			return;
		}
		if (result === 0)
		{
			if (!args)
			{
				session.Log("ERR VK - unexpected arguments");
				return;
			}
			m_enabledSecureInput = args.isSecureInput;
			m_protectedState = 2;	
			var needSecureInput = m_protectableSecureInputChecker.Test(m_activeElement);
			if (needSecureInput === needSecureInputCall)
				ShowBalloons();
			else
				CheckProtectModeAndShowBalloons();
			return;
		}
		else if (result === 1)
		{
			m_postponeStart = ns.SetTimeout(function() { OnElementFocus(m_activeElement); }, 100);
		}
		m_protectedState = 0;	
	}
	function OnError(e)
	{
		session.Log('ERR VK - ' + (e.message || e));
	}
	function StartProtect()
	{
		if (!document.hasFocus())
		{
			m_protectedState = 0;		
			ns.SessionLog("No focus on StartProtect");
			return;
		}
		var needSecureInput = m_protectableSecureInputChecker.Test(m_activeElement);
		m_protectedState = 1;	
		m_callFunction("vk.startProtect", {isSecureInput : needSecureInput}, function(result, args) { HandleStartProtectCallback(result, args, needSecureInput);}, OnError);
	}
	function ChangeMode()
	{
		var needSecureInput = m_protectableSecureInputChecker.Test(m_activeElement);
		m_protectedState = 1;	
		m_callFunction("vk.changeMode", {isSecureInput : needSecureInput}, function(result, args) { HandleStartProtectCallback(result, args, needSecureInput);}, OnError);
	}
	function StopProtect()
	{
		m_protectedState = 3;	
		m_callFunction("vk.stopProtect", null, function (result)
			{
				if (m_protectedState === 1 && result === 0)	
				{
					StartProtect();
					return;
				}
				m_protectedState = 0;		
			}, OnError);
	}
	function ShowBalloons()
	{
		if (m_enabledSecureInput)
			m_tooltip.Show(m_activeElement);
		if (m_protectableVirtualKeyboardIconChecker.Test(m_activeElement))
			m_icon.Show(m_activeElement);
	}
	function CheckProtectModeAndShowBalloons()
	{
		var needSecureInput = m_protectableSecureInputChecker.Test(m_activeElement);
		if (needSecureInput != m_enabledSecureInput)
			ChangeMode();
		else
			ShowBalloons();
	}
	function OnElementFocus(element)
	{
		if (m_shutdown)
			return;
		if (!NeedProtectElement(element))
			return;
		m_activeElement = element;
		m_lastFocusedElement = element;
		clearTimeout(m_postponeStart);
		clearTimeout(m_protectChangeTimeout);
		m_protectChangeTimeout = ns.SetTimeout(function () { ProcessFocus(); }, 0);
	}
	function OnElementBlur(element)
	{
		if (m_shutdown)
			return;
		if (m_activeElement == element && m_protectedText === m_activeElement.value)
			GenerateChangeEvent();
		clearTimeout(m_postponeStart);
		m_icon.Hide();
		m_tooltip.Hide();
		clearTimeout(m_protectChangeTimeout);
		m_protectChangeTimeout = ns.SetTimeout(function () { ProcessBlur(); }, 0);
	}
	function OnSettingsChanged(element)
	{
		var needProtectElement = NeedProtectElement(element);
		if ((m_activeElement !== element) ^ needProtectElement)
			return;
		if (needProtectElement)
			OnElementFocus(element);
		else
			OnElementBlur(element);
	}
	function ProcessFocus()
	{
		if (m_protectedState === 0)			
			StartProtect();
		else if (m_protectedState === 2) 	
			CheckProtectModeAndShowBalloons();
		else if (m_protectedState === 3)	
			m_protectedState = 1;			
	}
	function ProcessBlur()
	{
		if (m_protectedState === 2)	
			StopProtect();
		else if (m_protectedState === 1)	
			m_protectedState = 3;	
	}
	SetSettingsImpl(settings.vkMode, settings.skMode);
	ns.AddEventListener(window, 'unload', function ()
	{
		clearTimeout(m_protectChangeTimeout);
		clearTimeout(m_postponeStart);
		m_shutdown = true;
		m_observer.unbind();
	});
	var m_observer = new FocusChangeObserver(OnElementFocus, OnElementBlur, OnSettingsChanged);
};
function FocusChangeObserver(focusHandler, blurHandler, settingsChangedHandler)
{
	var m_targetPropertyName;
	if (document.addEventListener)
	{
		ns.AddEventListener(document, 'focus', onFocus);
		ns.AddEventListener(document, 'blur', onBlur);
		m_targetPropertyName = 'target';
	}
	else
	{
		ns.AddEventListener(document, 'focusin', onFocus);
		ns.AddEventListener(document, 'focusout', onBlur);
		m_targetPropertyName = 'srcElement';
	}
	var m_focusedElement = tryToGetFocusedInput();
	this.settingsChanged = function ()
	{
		if (m_focusedElement)
			settingsChangedHandler(m_focusedElement);
	}
	this.unbind = function ()
	{
		if (document.removeEventListener)
		{
			document.removeEventListener('focus', onFocus, true);
			document.removeEventListener('blur', onBlur, true);
		}
		else
		{
			document.detachEvent('onfocusin', onFocus);
			document.detachEvent('onfocusout', onBlur);
		}
		if (m_focusedElement)
		{
			blurHandler(m_focusedElement);
			m_focusedElement = null;
		}
	}
	if (m_focusedElement)
		focusHandler(m_focusedElement);
	function tryToGetActiveElement()
	{
		try
		{
			return document.activeElement;
		}
		catch (e)
		{}
		return null;
	}
	function tryToGetFocusedInput()
	{
		var element = tryToGetActiveElement();
		return (document.hasFocus() && isInputElement(element)) ? element : null;
	}
	function isInputElement(element)
	{
		return element &&
			element.tagName &&
			element.tagName.toLowerCase() === 'input';
	}
	function onBlur(event)
	{
		if (m_focusedElement)
		{
			var element = m_focusedElement;
			m_focusedElement = null;
			blurHandler(element);
		}
	}
	function onFocus(event)
	{
		var element = event[m_targetPropertyName];
		if (isInputElement(element))
		{
			m_focusedElement = element;
			focusHandler(element);
		}
	}
}
var instance = null;
ns.RunModule(function()
{
	try
	{
		if (!instance)
			instance = new VirtualKeyboard();
	}
	catch(e)
	{
		session.Log("VirtualKeyboard exception: " + (e.message || e));
	}
}, 2000);
});
KasperskyLab.AddRunner("cb", function (ns, session, settings, locales) {
    var ContentBlocker = function () {
        var m_idleStartTime = ns.GetCurrentTime();
        var m_callFunction = function () {};
        var m_deactivateFunction;
        session.InitializePlugin(function (activatePlugin, registerMethod, callFunction, deactivatePlugin) {
            m_deactivateFunction = deactivatePlugin;
            m_callFunction = callFunction;
            activatePlugin('cb', OnPing, OnError);
            registerMethod('cb.reloadUrl', ReloadUrl);
            registerMethod('cb.blockImage', BlockImage);
            registerMethod('cb.shutdown',
                function () {
                    deactivatePlugin('cb');
                });
        });
        function OnError(e) {
            session.Log('ERR CB - ' + (e.message || e));
        }
        function OnPing(currentTime) {
            var idleTime = (currentTime >= m_idleStartTime) ? currentTime - m_idleStartTime : 0;
            return idleTime <= 10000 ? 500 : ns.MaxRequestDelay;
        }
        function ReloadUrl() {
            session.Log("Start reload url " + document.readyState);
            m_idleStartTime = ns.GetCurrentTime();
            window.location.reload(true);
        }
        function BlockImage(blockImageRequest) {
            var blockImageResponse = { blockedImagesCount: 0, requestId: "" };
            var SendResponse = function()
            {
                m_callFunction("cb.BlockResults", blockImageResponse);
                SendResponse = function() {}
            }
            try
            {
                blockImageResponse.requestId = blockImageRequest.requestId;
                var blockImageByPath = function(url)
                {
                    var endsWithUrl = function(pattern) {
                        var d = pattern.length - url.length;
                        return d >= 0 && pattern.lastIndexOf(url) === d;
                    };
                    var images = document.getElementsByTagName('img');
                    for (var i = 0; i != images.length; ++i) {
                        if (endsWithUrl(images[i].src))
                            if (images[i].style.display != 'none') {
                                images[i].style.display = 'none';
                                ++blockImageResponse.blockedImagesCount;
                            }
                    }
                }
                for (var i = 0; i != blockImageRequest.urls.length; ++i) {
                    blockImageByPath(blockImageRequest.urls[i]);
                }
                SendResponse();
            }
            catch(e)
            {
                SendResponse();
                throw e;
            }
        }
    };
    try {
        new ContentBlocker();
    }
    catch (e) {
        session.Log('ContentBlocker exception ' + (e.message || e));
    }
});
var KasperskyLab = (function (ns)
{
function DomParser(session)
{
	var m_callFunction = function(){};
	var m_logins = [];
	var m_passwords = [];
	var m_newPasswords = [];
	var m_cachedFlag = false;
	function OnGetFieldsCallback(result, selectors, callback)
	{
	    if (result == 0 && selectors)
		{		    
		    Array.prototype.push.apply(m_logins, selectors.loginSelectors);
		    Array.prototype.push.apply(m_passwords, selectors.passwordSelectors);
		    Array.prototype.push.apply(m_newPasswords, selectors.newPasswordSelectors);
		    m_cachedFlag = true;
		}
		callback(result);
	}
	function CallService(commandName, argObject, clientCallback) 
	{
		m_callFunction("dp." + commandName, argObject, function(res, args) { OnGetFieldsCallback(res, args, clientCallback); });
	}
	function GetSelectorsFromService(clientCallback)
	{
		CallService("onGetFields", {dom: document.documentElement.innerHTML}, clientCallback);
	}
	function GetSelectorsInternal(callback, selectors)
	{
	    if (!m_cachedFlag)
	    {
	        GetSelectorsFromService(function (result) { callback(result, selectors); });
	    }
	    else
	    {
	        callback(0, selectors);
	    }	    
	}
	this.GetLoginSelectors = function(clientCallback)
	{
	    GetSelectorsInternal(clientCallback, m_logins);
	}
	this.GetPasswordSelectors = function (clientCallback)
	{
	    GetSelectorsInternal(clientCallback, m_passwords);
	}
	this.GetNewPasswordSelectors = function (clientCallback)
	{
	    GetSelectorsInternal(clientCallback, m_newPasswords);
	}
	function OnError(){}
	function OnPing()
	{
		return ns.MaxRequestDelay;
	}
	function OnInitializeCallback(activatePlugin, registerMethod, callFunction)
	{
		m_callFunction = callFunction;
		activatePlugin("dp", OnPing, OnError);
	}
	function InitializePlugin()
	{
		session.InitializePlugin(OnInitializeCallback);
	}
	InitializePlugin();
}
var gDomParser;
ns.GetDomParser = function(session)
{
	if (!gDomParser)
		gDomParser = new DomParser(session);
	return gDomParser;
}
return ns;
}) (KasperskyLab || {});
var KasperskyLab = (function (ns)
{
ns.Balloon2 = function(pluginName, balloonSrc, balloonCssPostfix, session, getCoordCallback, onCloseHandler, locales, onDataReceiveHandler)
{
	var m_balloon = document.createElement("iframe");
	var m_balloonId = pluginName + "_b";
	var m_balloonSize = null;
	var m_sizeCache = {};
	var m_initStyleDataPair = {};
	var m_isInitSent = false;
	var m_updateTimeout;
	var m_firstCreate = true;
	function InitializeBalloon()
	{
		m_balloon.scrolling = "no";
		m_balloon.frameBorder = "0";
		m_balloon.style.border = "0";
		m_balloon.style.height = "1px";
		m_balloon.style.width = "1px";
		m_balloon.style.left = "1px";
		m_balloon.style.top = "1px";
		m_balloon.allowTransparency = "true"; 
		m_balloon.style.zIndex = "2147483647";
		m_balloon.style.position = "absolute";
		document.body.appendChild(m_balloon);
		HideBalloon();
	}
	function OnPing()
	{
		return IsDisplayed() ? 100 : ns.MaxRequestDelay;
	}
	function SendToFrame(args)
	{
		m_balloon.contentWindow.postMessage(ns.JSONStringify(args), "*");
	}
	function OnSizeMessage(sizeMessage)
	{
		var size = {
			height: sizeMessage.height,
			width: sizeMessage.width
		};
		if (size.height != 0 && size.width != 0)
		    PutSizeInCache(sizeMessage.style, size);
		SetupBalloon(size);
	}
	function OnCloseMessage(closeData)
	{
		HideBalloon();
		if (onCloseHandler && closeData.closeAction)
			onCloseHandler(closeData.closeAction);
	}
	function OnDataMessage(data)
	{
		if (onDataReceiveHandler)
			onDataReceiveHandler(data);
	}
	function ChangeSchemeIfNeed(url)
	{
		if (document.location.protocol === "https:")
			return url.replace("http:", "https:");
		return url;
	}
	function CreateBalloon(style, data, size)
	{
		if (m_firstCreate)
		{
			InitializeBalloon();
			m_firstCreate = false;
		}
		DisplayBalloon();
		if (m_balloon.src)
		{
			UpdateBalloon(style, data);
			return;
		}
		m_initStyleDataPair = {style: style, data: data};
		var fullSrc;
		if (typeof(balloonSrc) == "object")
			fullSrc = balloonSrc.src;
		else
			fullSrc = ns.GetResourceSrc(balloonSrc); 
		m_balloon.src = balloonCssPostfix
			? fullSrc + "?cssSrc=" + encodeURIComponent(ChangeSchemeIfNeed(ns["GetResourceSrc"](balloonCssPostfix)))
			: fullSrc;
		var balloonSize = size ? size : GetSizeFromCache(style);
		var dataToFrame = {
			command: "init",
			pluginName: m_balloonId,
			commandUrl: ChangeSchemeIfNeed(ns.GetCommandSrc()),
			isRtl: ns.IsRtl,
			needSize: !balloonSize,
			style: style
		};
		if (data)
			dataToFrame.data = data;
		if (size)
			dataToFrame.explicitSize = size;
		if (locales)
			dataToFrame.locales = locales;
		ns.AddEventListener(m_balloon, "load", function(){SendInit(dataToFrame);});
		if (balloonSize)
		{
			clearTimeout(m_updateTimeout);
			m_updateTimeout = ns.SetTimeout(function(){SetupBalloon(balloonSize);}, 0);
		}
	}
	function SendInit(dataToFrame)
	{
		dataToFrame.style = m_initStyleDataPair.style;
		dataToFrame.data = m_initStyleDataPair.data;
		m_isInitSent = true;
		SendToFrame(dataToFrame);
		session.ForceReceive();
	}
	function DisplayBalloon()
	{
		m_balloon.style.display = "";
		session.ForceReceive();
	}
	function IsDisplayed()
	{
		return !m_firstCreate && m_balloon.style.display === "";
	}
	function HideBalloon()
	{
		m_balloon.style.display = "none";
	}
	function DestroyBalloon()
	{
		m_balloon.blur(); 
		document.body.removeChild(m_balloon);
		m_firstCreate = true;
		m_balloonSize = null;
	}
	function PositionBalloon()
	{
		if (!m_balloonSize)
			return;
		var coords = getCoordCallback(m_balloonSize);
		m_balloon.style.height = m_balloonSize.height + "px";
		m_balloon.style.width = m_balloonSize.width + "px";
		m_balloon.style.left = Math.round(coords.x).toString() + "px";
		m_balloon.style.top = Math.round(coords.y).toString() + "px";
	}
	function SetupBalloon(balloonSize)
	{
		m_balloonSize = balloonSize;
		PositionBalloon();
	}
	function UpdateBalloon(style, data)
	{
		if (!m_isInitSent)
			m_initStyleDataPair = {style: style, data: data};
		var sizeFromCache = GetSizeFromCache(style);
		clearTimeout(m_updateTimeout);
		if (sizeFromCache)
		{
			m_updateTimeout = ns.SetTimeout(function(){SetupBalloon(sizeFromCache);}, 0);
		}
		else
		{
			m_balloon.style.height = "1px";
			m_balloon.style.width = "1px";
			m_balloonSize = {height: 1, width: 1};
		}
		var dataToFrame = {
			command: "update",
			style: style,
			data: data,
			needSize: !sizeFromCache
		};
		SendToFrame(dataToFrame);
	}
	function GetSizeFromCache(style)
	{
		return m_sizeCache[style ? style.toString() : ""];
	}
	function PutSizeInCache(style, size)
	{
		m_sizeCache[style ? style.toString() : ""] = size;
	}
	this.Show = function(style, data)
	{
		CreateBalloon(style, data);
	}
	this.ShowWithSize = function(style, data, size)
	{
		CreateBalloon(style, data, size);
	}
	this.Resize = function(size)
	{
		SetupBalloon(size);
	}
	this.Hide = function()
	{
		HideBalloon();
	}
	this.Update = function(style, data)
	{
		UpdateBalloon(style, data);
	}
	this.UpdatePosition = function()
	{
		PositionBalloon();
	}
	this.Destroy = function()
	{
		DestroyBalloon();
	}
	session.InitializePlugin(
			function (activatePlugin, registerMethod, callFunction, deactivatePlugin) {
				activatePlugin(m_balloonId, OnPing);
				registerMethod(
					m_balloonId + ".message",
					function (message)
					{
						if (!message)
						{
							ns.SessionLog(m_balloonId + " wrong message. message: " + args);
							return;
						}
						if (message.type === "size")
							OnSizeMessage(message.data);
						else if (message.type === "close")
							OnCloseMessage(message.data);
						else if (message.type === "data")
							OnDataMessage(message.data);
						else
							ns.SessionLog("Unknown message type: " + message.type);
					});
			});
};
return ns;
}) (KasperskyLab || {});

 })();