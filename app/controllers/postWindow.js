var AppData = require('data');
var args = arguments[0] || {};
var dataId = (args.dataId === 0 || args.dataId > 0) ? args.dataId : '';
if(!dataId)
	console.log("Form:"+dataId);

//Static UI configuration
$.win.orientationModes = [
	//Ti.UI.LANDSCAPE_LEFT, TODO: Having some orientation problems on file upload, disable for now
	//Ti.UI.LANDSCAPE_RIGHT,
	Ti.UI.PORTRAIT,
	Ti.UI.UPSIDE_PORTRAIT
];

var focused = true,
	postContainer = $.postFormView.getView();

if (OS_IOS) {
	function handleKeyboard(e) {
		if (focused) {
			if (Ti.Gesture.orientation === Ti.UI.LANDSCAPE_LEFT || Ti.Gesture.orientation === Ti.UI.LANDSCAPE_RIGHT) {
				postContainer.bottom = e.keyboardFrame.height+'dp';
			}
			else {
				postContainer.bottom = (e.keyboardFrame.height+5)+'dp';
			}
		}
	}
	Ti.App.addEventListener('keyboardFrameChanged', handleKeyboard);
	
	//Also iOS only - need to handle orientation resizing
	function handleOrientation(e) {
		if (focused) {
			var orientation = (e && e.orientation) ? e.orientation : Ti.Gesture.orientation;
			if (orientation === Ti.UI.LANDSCAPE_LEFT || orientation === Ti.UI.LANDSCAPE_RIGHT) {
				postContainer.animate({
					top:0,
					left:0,
					right:0,
					duration:250
				});
			}
			else {
				postContainer.animate({
					top:'50dp',
					left:'5dp',
					right:'5dp',
					duration:250
				});
			}
		}
	}
	//Ti.Gesture.addEventListener('orientationchange', handleOrientation);
}

$.back.on('click', function() {
	$.win.close();
});

$.postFormView.on('focus', function() {
	focused = true;
	if (OS_IOS) {
		handleOrientation();
	}
});

$.postFormView.on('blur', function() {
	focused = false;
	postContainer.animate({
		top:'50dp',
		bottom:'5dp',
		left:'5dp',
		right:'5dp',
		duration:250
	});
});

$.postFormView.on('success', function() {
	$.win.close();
});

$.win.on('open', function() {

	//$.postFormView.focus();
});

//Clean up - remember to remove global event handlers if you don't need them anymore!
$.win.on('close', function() {
	if (OS_IOS) {
		Ti.App.removeEventListener('keyboardFrameChanged', handleKeyboard);
		//Ti.Gesture.removeEventListener('orientationchange', handleOrientation);
	}
});

$.openWindow = function() {
	$.win.open({
		modal:true
	});
};
