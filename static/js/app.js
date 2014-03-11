var App = {
	p: true,
	uploader: false,
	e: {
		'10': 'Please type your name',
		'20': 'Please type your email address',
		'25': 'Invalid email address',
		'27': 'This email address is already in our database.<br />Please use the <a href="#" onclick="return App.Rec();">password recovery</a> function.',
		'30': 'Please type the desired login',
		'35': 'Invalid login',
		'37': 'This login is not available',
		'40': 'Please type the desired password',
		'45': 'The password must be at least 4 characters long',
		'50': 'Please re-type the password',
		'55': 'The passwords do not match',
		
		'1010': 'Please type your login',
		'1020': 'Please type the password',
		'1030': 'Login failed',
		
		'2010': 'Please type the login',
		
		'3017': 'Email address not found in database',
		
		'4015': 'You are already subscribed',
		'4016': 'You are not subscribed',
		
		'5010': 'Enter the name'
	},
	
	m: {
		'10': 'Registration Successful',
		'3010': 'Your password has been sent',
		'4010': 'You have been subscribed',
		'4015': 'You have been unsubscribed',
		'5010': 'Saved'
	},
	
	UOps: function() {
		Ui.Req('/r/acc/uops.req.php');
		return false;
	},
	
	RegDo: function(f) {
		if (this.RegVal(f)) {
			$('xsubmit2').disabled = true;
			new Ajax.Request(
				'/r/acc/register_do.req.php', {
					method: 'post',
					postBody: _GDU(f),
					onComplete: function(t) {
						$('xsubmit2').disabled = false;
						var a = t.responseText.split("@@@@@");
						if (a[0] == 'OK') {
							App.ClrFrm(document.xdfrm2);
							App.M('main2', App.m[10]);
						} else if (a[0] == 'ERR') {
							alert(t.responseText);
							for (var i = 1; i < a.length; i++) {
								b = a[i].split(',');
								App.E(b[0], App.e[b[1]]);
							}
						} else {
							alert(t.responseText);
						}
					}
				}
			);
		}
		return false;
	},
	RegVal: function(f) {
		this.p = true;
		this.ClrErr(f);
		if (!f.name.value.length)
			this.p = this.E(f.name, this.e[10]);
		if (!f.email.value.length)
			this.p = this.E(f.email, this.e[20]);
		else if (!/^[a-zA-Z0-9]([\w\.-]*[a-zA-Z0-9])?@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/.test(f.email.value))
			this.p = this.E(f.email, this.e[25]);
		if (!f.rlogin.value.length)
			this.p = this.E(f.rlogin, this.e[30]);
		else if (!/^[a-zA-Z0-9]+$/.test(f.rlogin.value))
			this.p = this.E(f.rlogin, this.e[35]);
		if (!f.rpass.value.length)
			this.p = this.E(f.rpass, this.e[40]);
		else if (f.rpass.value.length < 4)
			this.p = this.E(f.rpass, this.e[45]);
		if (!f.pass2.value.length)
			this.p = this.E(f.pass2, this.e[50]);
		else if (f.rpass.value != f.pass2.value)
			this.p = this.E(f.pass2, this.e[55]);
		
		return this.p;
	},
	onLogout: function() {
		
	},
	Logout: function() {
		new Ajax.Updater('usrops', '/r/acc/logout.req.php', {
			onComplete: function(t) {
				App.onLogout();
			}
		});
		return false;
	},
	
	onLogin: function() {
		
	},
	LogDo: function(f) {
		if (this.LogVal(f)) {
			$('xsubmit1').disabled = true;
			new Ajax.Request(
				'/r/acc/login_do.req.php', {
					method: 'post',
					postBody: _GDU(f),
					onComplete: function(t) {
						$('xsubmit1').disabled = false;
						var a = t.responseText.split("@@@@@");
						if (a[0] == 'OK') {
							Ui.Cl();
							$('usrops').innerHTML = a[1];
							App.onLogin();
						} else if (a[0] == 'ERR') {
							for (var i = 1; i < a.length; i++) {
								b = a[i].split(',');
								App.E(b[0], App.e[b[1]]);
							}
						} else {
							alert(t.responseText);
						}
					}
				}
			);
		}
		return false;
	},
	LogVal: function(f) {
		this.p = true;
		this.ClrErr(f);
		if (!f.login.value.length)
			this.p = this.E(f.login, this.e[1010]);
		else if (!/^[a-zA-Z0-9\_]+$/.test(f.login.value))
			this.p = this.E(f.login, this.e[35]);
		if (!f.pass.value.length)
			this.p = this.E(f.pass, this.e[1020]);
		else if (f.pass.value.length < 4)
			this.p = this.E(f.pass, this.e[45]);
		return this.p;
	},
	RecDo: function(f) {
		App.M('main3', '');
		if (this.RecVal(f)) {
			$('xsubmit3').disabled = true;
			new Ajax.Request(
				'/r/acc/recover_do.req.php', {
					method: 'post',
					postBody: _GDU(f),
					onComplete: function(t) {
						$('xsubmit3').disabled = false;
						var a = t.responseText.split("\n");
						if (a[0] == 'OK') {
							App.ClrFrm(document.xdfrm3);
							App.M('main3', App.m[3010]);
						} else if (a[0] == 'ERR') {
							for (var i = 1; i < a.length; i++) {
								b = a[i].split(',');
								App.E(b[0], App.e[b[1]]);
							}
							
						} else {
							alert(t.responseText);
						}
					}
				}
			);
		}
		return false;
	},
	RecVal: function(f) {
		this.p = true;
		this.ClrErr(f);
		if (!f.emailr.value.length)
			this.p = this.E(f.emailr, this.e[20]);
		else if (!/^[a-zA-Z0-9]([\w\.-]*[a-zA-Z0-9])?@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/.test(f.emailr.value))
			this.p = this.E(f.emailr, this.e[25]);
		return this.p;
	},
	EditImg: function(id) {
		Ui.Req('/r/img/edit.req.php', {
			method: 'post',
			postBody: 'id='+id
		});
		return false;
	},
	EditImgDo: function(id, f) {
		App.M('main', '');
		if (this.EditImgVal(f)) {
			$('xsubmit').disabled = true;
			new Ajax.Request(
				'/r/img/edit_do.req.php', {
					method: 'post',
					postBody: 'id='+id+'&'+_GDU(f),
					onComplete: function(t) {
						$('xsubmit').disabled = false;
						var a = t.responseText.split("\n");
						if (a[0] == 'OK') {
							App.M('main', App.m[5010]);
						} else if (a[0] == 'ERR') {
							for (var i = 1; i < a.length; i++) {
								b = a[i].split(',');
								App.E(b[0], App.e[b[1]]);
							}
							
						} else {
							alert(t.responseText);
						}
					}
				}
			);
		}
		return false;
	},
	DelImg: function(id) {
		if (!confirm('Permanently delete this image?'))
			return false;
		$('dellink').innerHTML = 'Deleting';
		$('dellink').onclick = function() { return false; }
		new Ajax.Request('/r/img/del.req.php', {
			method: 'post',
			postBody: 'id='+id,
			onComplete: function(t) {
				var a = t.responseText.split("\n");
				if (a[0] == 'OK') {
					$('dellink').innerHTML = 'Deleted';
				} else {
					$('dellink').innerHTML = 'Failed';
					alert(t.responseText);
				}
			}
		});
		return false;
	},
	EditImgVal: function(f) {
		this.p = true;
		this.ClrErr(f);
		if (!f.name.value.length)
			this.p = this.E(f.name, this.e[5010]);
		return this.p;
	},
	ClrErr: function(f) {
		var a = f.getElementsByTagName('div');
		for (var i = 0; i < a.length; i++)
			if (a[i].className == 'err')
				a[i].innerHTML = '';
	},
	ClrFrm: function(f) {
		var b = getFormElements(f);
		for (var i = 0; i < b.length; i++)
			if (b[i].type.toUpperCase() != 'RADIO')
				b[i].value = '';
	},
	E: function(e, t) {
		if (a = $('xe_'+(typeof(e) == 'string' ? e : e.name))) {
			a.style.display = 'block';
			a.innerHTML = t;
		}
		else
			alert(t);
		if (this.p) {
			try {
				e.focus();
			} catch (e) { };
		}
		return false;
	},
	M: function(e, t) {
		var t = t || '';
		if (a = $('xm_'+e)) {
			a.style.display = t ? 'block' : 'none';
			a.innerHTML = t;
		}
		else
			alert(t);
		return false;
	}
}

var U = {
	ids: [], ect: 1, su:false,
	Upl: function() {
		Ui.Req('/r/up/dia.req.php', {
			onAfterDraw:function(t, j, o) {
				U.init();
			}
		});
		return false; 
	},
	init: function() {
		if (U.su)
			U.su.destroy();
		U.su = new SWFUpload({
			upload_url: '/r/up/up.req.php?PHPSESSID='+PHPSESSID,
			button_placeholder_id : "uploader",
			file_queue_limit: 100,
			file_queue_error_handler: function(file, errorCode, message) {
				$('uterms').style.display = 'none';
				$('ulog').style.display = 'block';
				$('ulog').innerHTML += '<span class="err">Queue error: <b>' + file.name + '</b><br />';
			},
			file_dialog_complete_handler: function(numFilesSelected, numFilesQueued) {
				try {
					if (this.getStats().files_queued > 0) {
						$('ubtn').style.visibility = 'visible';
					}
				} catch (ex) {
					alert(ex);
				}
			},
			file_queued_handler: function(file) {
				$('uterms').style.display = 'none';
				$('ulog').style.display = 'block';
				$('ulog').innerHTML += '<span id="f'+file.id+'">Queued <b>' + file.name + '</b></span><br />';
			},
			upload_error_handler: function(file, errorCode, message) {
				var e = $('f'+file.id);
				if (e)
					e.innerHTML = '<span class="err">Upload error <b>' + file.name + '</b>: '+message+'</span>';
				else
					$('ulog').innerHTML += '<span class="err">Upload error <b>' + file.name + '</b>: '+message+'</span><br />';
				if (this.getStats().files_queued > 0) {
					this.startUpload();
				} else {
					$('uloading').style.display = 'none';
				}
			},
			upload_progress_handler: function(file, bc, bt) {
				var e = $('f'+file.id);
				if (e)
				{
					if (bc >= bt)
						e.innerHTML = '<span class="msg">Processing <b>' + file.name + '</b></span>';
					else
						e.innerHTML = '<span class="msg">Uploading <b>' + file.name + '</b>: ' + bc + '/' + bt + '</span>';
				}
			},
			upload_success_handler: function(file, data, response) {
				var a = data.split("\n");
				if (a[0] == 'OK') {
					var e = $('f'+file.id);
					if (e)
						e.innerHTML = '<span class="msg">Uploaded <b>' + file.name + '</b></span>';
					else
						$('ulog').innerHTML += 'Uploaded <b>' + file.name + '</b><br />';
					U.ids.push(a[1]);
					U.SM(U.ids);
				} else {
					var e = $('f'+file.id);
					if (e)
						e.innerHTML = '<span class="err">Upload error <b>' + file.name + '</b>: '+data+'</span>';
					else
						$('ulog').innerHTML += '<span class="err">Upload error <b>' + file.name + '</b>: '+data+'</span><br />';
				}
				if (this.getStats().files_queued > 0) {
					this.startUpload();
				} else {
					$('uloading').style.display = 'none';
				}
			}
		});
		U.SM(U.ids);
	},
	SU: function() {
		if (!this.su.getStats().files_queued)
			return false;
		$('uloading').style.display = 'block';
		this.su.startUpload();
	},
	SM: function(ids) {
		if (!ids.length)
			$('usum').innerHTML = '';
		else
			new Ajax.Updater('usum', '/r/up/summary.req.php?ect='+this.ect+'&ids='+ids);
	}
}

var Im = {
	h: function(id, type) {
		new Ajax.Request('/r/img/h.req.php', { method:'post', asynchronous:false, postBody:'id='+id+'&type='+type, onComplete: function(t) { if (0 && t.responseText.length) alert(t.responseText); } });
	},
	sh: function(sid, iid) {
		new Ajax.Request('/r/img/sh.req.php', { method:'post', asynchronous:false, postBody:'iid='+iid+'&sid='+sid, onComplete: function(t) { if (0 && t.responseText.length) alert(t.responseText); } });
	},
	z: function(i) {
		var ws = getWS();
		Ui.Req('/r/img/z.req.php', {
			method: 'post',
			postBody: 'id='+i+'&w='+ws[0]+'&h='+ws[1]
		});
		return false;
	},
	re: function(id) {
		Ui.Req('/r/img/report.req.php', {
			method: 'post',
			postBody: 'id='+id
		});
		return false;
	},
	red: function(f, id) {
		$('xsubmit').disabled = true;
		$('xe_option').innerHTML = '';
		$('xe_comments').innerHTML = '';
		$('xm_main').innerHTML = '';
		var option_id = 0;
		for (var i = 0; i < f.option_id.length; i++)
			if (f.option_id[i].checked)
				option_id = f.option_id[i].value;
		if (!option_id) {
			$('xe_option').innerHTML = 'Choose an option';
			$('xsubmit').disabled = false;
			return false;
		}
		if ((option_id == 9 || option_id == 7) && !f.comments.value.length) {
			$('xe_comments').innerHTML = 'Additional comments are required for the selected option';
			$('xsubmit').disabled = false;
			return false;
		}
		new Ajax.Request('/r/img/report_do.req.php', {
			method: 'post',
			postBody: 'id='+id+'&option_id='+option_id+'&comments='+encodeURIComponent(f.comments.value),
			onComplete: function(t) {
				var a = t.responseText.split("\n");
				if (a[0] == 'OK') {
					$('xm_main').innerHTML = 'Your report has been saved and will be processed.<br />Thank you.';
				} else {
					alert(t.responseText);
					$('xsubmit').disabled = false;
				}
			}
		});
		return false;
	}
}

function getScrollTop() { 
	if (typeof(pageYOffset) != 'undefined')
        return pageYOffset; 
	var B = document.body;
	var D = document.documentElement; 
	D = (D.clientHeight) ? D: B;
	return D.scrollTop;
}

function getDocHeight() {
	var D = document;
    return Math.max(
		Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
		Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
		Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
}

function getWS() {
	var winW = 630, winH = 460;
	if (document.body && document.body.offsetWidth) {
		winW = document.body.offsetWidth;
		winH = document.body.offsetHeight;
	}
	if (document.compatMode == 'CSS1Compat' && document.documentElement && document.documentElement.offsetWidth) {
		winW = document.documentElement.offsetWidth;
		winH = document.documentElement.offsetHeight;
	}
	if (window.innerWidth && window.innerHeight) {
		winW = window.innerWidth;
		winH = window.innerHeight;
	}
	return [winW, winH];
}

function getPos(el) {
	for (var lx = 0, ly=0; el != null; lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return {x:lx, y:ly};
}

var Ui = {
	Req: function(f, p) {
		var p = p || {};
		p.onComplete = function(t, j, o) {
			if (o.options.obBeforeDraw)
				o.options.obBeforeDraw(t, j, o);
			
			$('ajopr').innerHTML = t.responseText;
			$('ajopc').style.height = getDocHeight() + 'px';
			var tb = $('ajopc').getElementsByTagName('table')[0];
			tb.style.marginTop = (getScrollTop() + 60) + 'px';
			
			if (o.options.onAfterDraw)
				o.options.onAfterDraw(t, j, o);
		};
		
		new Ajax.Request(f, p);
	},
	Cl: function() {
		$('ajopr').innerHTML = '';
		return false;
	}
}

var PG = {
	N: false, P:false,
	I: function() {
		document.onkeydown = function(e) {
			var e = e || window.event;
			if (e.keyCode == 39 && PG.N) {
				if (PG.CK(e))
					return true;
				typeof(PG.N) == 'function' ? PG.N() : document.location.href = PG.N;
				return false;
			}
			if (e.keyCode == 37 && PG.P) {
				if (PG.CK(e))
					return true;
				typeof(PG.P) == 'function' ? PG.P() : document.location.href = PG.P;
				return false;
			}
			return true;
		}
	},
	CK: function(e) {
		if (e.target) {
			if (e.target.tagName.toUpperCase() != 'HTML' && e.target.tagName.toUpperCase() != 'BODY')
				return true;
			return false;
		}
		else if (e.srcElement) {
			if (e.srcElement != document.body)
				return true;
			return false;
		}
		return false;
	}
}

var Box = {
	Arr: function(el) {
		var ws = getWS();
		var dw = ws[0] - 20;
		var a = el.getElementsByTagName('li');
		if (!a.length)
			return;
		var ew = a[0].clientWidth;
		var margin = 5;
		var cmargin = 10;
		var fit = Math.floor((dw - cmargin * 2) / (ew + margin * 2));
		fit = Math.min(fit, a.length);
		var margin = Math.floor((dw - cmargin * 2 - ew * fit) / 2  / fit);
		var hmargin = Math.floor(margin * 1);
		var elw = fit * (ew + margin * 2);
		el.style.position = 'relative';
		el.style.width = elw + 'px';
		if (a.length <= fit)
			hmargin = 0;
		el.style.margin = '-'+hmargin+'px auto';
		for (var i = 0; i < a.length; i++) {
			a[i].style.margin = hmargin + 'px ' + margin + 'px';
		}
	}
}

var Ta = {
	ck: [],
	A: function(id, k) {
		if (!this.ck[id])
			this.ck[id] = 0;
		
		$('th_'+id+'_'+this.ck[id]).className = '';
		$('tc_'+id+'_'+this.ck[id]).style.display = 'none';
		
		$('th_'+id+'_'+k).className = 'active';
		$('tc_'+id+'_'+k).style.display = 'block';
		
		this.ck[id] = k;
		return false;
	}
}

function fPos() {
	var ws = getWS();
	var dh = getDocHeight();
	if (dh > ws[1])
		return false;
	var fe = $('footer');
	fe.style.position = 'fixed';
	fe.style.bottom = '0'; 
}

function _GDU(f) {
	var s = '';
	var e = getFormElements(f);
	for (var i = 0; i < e.length; i++)
		if ((e[i].tagName.toLowerCase() == 'input' && (e[i].type == 'text' || e[i].type == 'password' || e[i].type == 'hidden')) || e[i].tagName.toLowerCase() == 'textarea' || (e[i].tagName.toLowerCase() == 'select' && !e[i].multiple))
			s += '&' + encodeURIComponent(e[i].name) + '=' + encodeURIComponent(e[i].value);
		else if (e[i].tagName.toLowerCase() == 'select' && e[i].multiple) {
			for (var j = 0; j < e[i].options.length; j++)
				if (e[i].options[j].selected)
					s += '&' + encodeURIComponent(e[i].name) + '=' + encodeURIComponent(e[i].options[j].value);
		}
		else if (e[i].tagName.toLowerCase() == 'input' && e[i].type == 'checkbox')
			s += '&' + encodeURI(e[i].name).replace(/&/g, '%26') + '=' + (e[i].checked?1:0);
		else if (e[i].tagName.toLowerCase() == 'input' && e[i].type == 'radio' && e[i].checked)
			s += '&' + encodeURI(e[i].name).replace(/&/g, '%26') + '=' + encodeURIComponent(e[i].value);
	return s.substr(1);
}

function getFormElements(f) {
	var ret = [];
	var e = f.getElementsByTagName('input');
	for (var i = 0; i < e.length; i++)
		if (e[i].type.toLowerCase() != 'submit')
			ret.push(e[i]);
	var e = f.getElementsByTagName('textarea');
	for (var i = 0; i < e.length; i++)
		ret.push(e[i]);
	var e = f.getElementsByTagName('select');
	for (var i = 0; i < e.length; i++)
		ret.push(e[i]);
	return ret;
}

String.prototype.trim = function(mask) {
	var mask = mask || '\\s';
	var Re = new RegExp('^['+mask+']+|['+mask+']+$', 'g');
	return this.replace(Re, '');
};

var Prototype = {
	Version: '1.4.0_pre10_ajax',
	
	emptyFunction: function() {},
	K: function(x) {return x}
}

var Class = {
	create: function() {
		return function() { 
			this.initialize.apply(this, arguments);
		}
	}
}

var Abstract = new Object();

Object.extend = function(destination, source) {
	for (property in source) {
		destination[property] = source[property];
	}
	return destination;
}

Object.inspect = function(object) {
	try {
		if (object == undefined) return 'undefined';
		if (object == null) return 'null';
		return object.inspect ? object.inspect() : object.toString();
	} catch (e) {
		if (e instanceof RangeError) return '...';
		throw e;
	}
}

Function.prototype.bind = function(object) {
	var __method = this;
	return function() {
		return __method.apply(object, arguments);
	}
}

Function.prototype.bindAsEventListener = function(object) {
	var __method = this;
	return function(event) {
		return __method.call(object, event || window.event);
	}
}

Object.extend(Number.prototype, {
	toColorPart: function() {
		var digits = this.toString(16);
		if (this < 16) return '0' + digits;
		return digits;
	},

	succ: function() {
		return this + 1;
	},
	
	times: function(iterator) {
		$R(0, this, true).each(iterator);
		return this;
	}
});

var Try = {
	these: function() {
		var returnValue;

		for (var i = 0; i < arguments.length; i++) {
			var lambda = arguments[i];
			try {
				returnValue = lambda();
				break;
			} catch (e) {}
		}

		return returnValue;
	}
}


var PeriodicalExecuter = Class.create();
PeriodicalExecuter.prototype = {
	initialize: function(callback, frequency) {
		this.callback = callback;
		this.frequency = frequency;
		this.currentlyExecuting = false;

		this.registerCallback();
	},

	registerCallback: function() {
		setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
	},

	onTimerEvent: function() {
		if (!this.currentlyExecuting) {
			try { 
				this.currentlyExecuting = true;
				this.callback(); 
			} finally { 
				this.currentlyExecuting = false;
			}
		}
	}
}





var Ajax = {
	getTransport: function() {
		return Try.these(
			function() {return new ActiveXObject('Msxml2.XMLHTTP')},
			function() {return new ActiveXObject('Microsoft.XMLHTTP')},
			function() {return new XMLHttpRequest()}
		) || false;
	}
}

Ajax.Base = function() {};
Ajax.Base.prototype = {
	setOptions: function(options) {
		this.options = {
			method:			 'post',
			asynchronous: true,
			parameters:	 ''
		}
		Object.extend(this.options, options || {});
	},

	responseIsSuccess: function() {
		return this.transport.status == undefined
				|| this.transport.status == 0 
				|| (this.transport.status >= 200 && this.transport.status < 300);
	},

	responseIsFailure: function() {
		return !this.responseIsSuccess();
	}
}

Ajax.Request = Class.create();
Ajax.Request.Events = 
	['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];

Ajax.Request.prototype = Object.extend(new Ajax.Base(), {
	initialize: function(url, options) {
		this.transport = Ajax.getTransport();
		this.setOptions(options);
		this.request(url);
	},

	request: function(url) {
		var parameters = this.options.parameters || '';
		if (parameters.length > 0) parameters += '&_=';

		try {
			if (this.options.method == 'get')
				url += '?' + parameters;

			this.transport.open(this.options.method, url,
				this.options.asynchronous);

			if (this.options.asynchronous) {
				this.transport.onreadystatechange = this.onStateChange.bind(this);
				setTimeout((function() {this.respondToReadyState(1)}).bind(this), 10);
			}

			this.setRequestHeaders();

			var body = this.options.postBody ? this.options.postBody : parameters;
			this.transport.send(this.options.method == 'post' ? body : null);

		} catch (e) {
		}
	},

	setRequestHeaders: function() {
		var requestHeaders = 
			['X-Requested-With', 'XMLHttpRequest',
			 'X-Prototype-Version', Prototype.Version];

		if (this.options.method == 'post') {
			requestHeaders.push('Content-type', 
				'application/x-www-form-urlencoded');

			if (this.transport.overrideMimeType)
				requestHeaders.push('Connection', 'close');
		}

		if (this.options.requestHeaders)
			requestHeaders.push.apply(requestHeaders, this.options.requestHeaders);

		for (var i = 0; i < requestHeaders.length; i += 2)
			this.transport.setRequestHeader(requestHeaders[i], requestHeaders[i+1]);
	},

	onStateChange: function() {
		var readyState = this.transport.readyState;
		if (readyState != 1)
			this.respondToReadyState(this.transport.readyState);
	},
	
	evalJSON: function() {
		try {
			var json = this.transport.getResponseHeader('X-JSON'), object;
			object = eval(json);
			return object;
		} catch (e) {
		}
	},

	respondToReadyState: function(readyState) {
		var event = Ajax.Request.Events[readyState];
		var transport = this.transport, json = this.evalJSON();

		if (event == 'Complete')
			(this.options['on' + this.transport.status]
			 || this.options['on' + (this.responseIsSuccess() ? 'Success' : 'Failure')]
			 || Prototype.emptyFunction)(transport, json);

		(this.options['on' + event] || Prototype.emptyFunction)(transport, json, this);

		if (event == 'Complete')
			this.transport.onreadystatechange = Prototype.emptyFunction;
	}
});

Ajax.Updater = Class.create();
Ajax.Updater.ScriptFragment = '(?:<script.*?>)((\n|.)*?)(?:<\/script>)';

Object.extend(Object.extend(Ajax.Updater.prototype, Ajax.Request.prototype), {
	initialize: function(container, url, options) {
		this.containers = {
			success: container.success ? $(container.success) : $(container),
			failure: container.failure ? $(container.failure) :
				(container.success ? null : $(container))
		}

		this.transport = Ajax.getTransport();
		this.setOptions(options);

		var onComplete = this.options.onComplete || Prototype.emptyFunction;
		this.options.onComplete = (function(transport, object) {
			this.updateContent();
			onComplete(transport, object);
		}).bind(this);

		this.request(url);
	},

	updateContent: function() {
		var receiver = this.responseIsSuccess() ?
			this.containers.success : this.containers.failure;

		var match		= new RegExp(Ajax.Updater.ScriptFragment, 'img');
		var response = this.transport.responseText.replace(match, '');
		var scripts	= this.transport.responseText.match(match);

		if (receiver) {
			if (this.options.insertion) {
				new this.options.insertion(receiver, response);
			} else {
				receiver.innerHTML = response;
			}
		}

		if (this.responseIsSuccess()) {
			if (this.onComplete)
				setTimeout(this.onComplete.bind(this), 10);
		}

		if (this.options.evalScripts && scripts) {
			match = new RegExp(Ajax.Updater.ScriptFragment, 'im');
			setTimeout((function() {
				for (var i = 0; i < scripts.length; i++)
					eval(scripts[i].match(match)[1]);
			}).bind(this), 10);
		}
	}
});

Ajax.PeriodicalUpdater = Class.create();
Ajax.PeriodicalUpdater.prototype = Object.extend(new Ajax.Base(), {
	initialize: function(container, url, options) {
		this.setOptions(options);
		this.onComplete = this.options.onComplete;

		this.frequency = (this.options.frequency || 2);
		this.decay = 1;

		this.updater = {};
		this.container = container;
		this.url = url;

		this.start();
	},

	start: function() {
		this.options.onComplete = this.updateComplete.bind(this);
		this.onTimerEvent();
	},

	stop: function() {
		this.updater.onComplete = undefined;
		clearTimeout(this.timer);
		(this.onComplete || Ajax.emptyFunction).apply(this, arguments);
	},

	updateComplete: function(request) {
		if (this.options.decay) {
			this.decay = (request.responseText == this.lastText ? 
				this.decay * this.options.decay : 1);

			this.lastText = request.responseText;
		}
		this.timer = setTimeout(this.onTimerEvent.bind(this), 
			this.decay * this.frequency * 1000);
	},

	onTimerEvent: function() {
		this.updater = new Ajax.Updater(this.container, this.url, this.options);





	}
});

function $() {
	var elements = new Array();

	for (var i = 0; i < arguments.length; i++) {
		var element = arguments[i];
		if (typeof element == 'string')
			element = document.getElementById(element);

		if (arguments.length == 1) 
			return element;

		elements.push(element);
	}

	return elements;
}