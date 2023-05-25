var window = document.defaultView;

var haveEvents = 'GamepadEvent' in window;
var haveWebkitEvents = 'WebKitGamepadEvent' in window;
var controllers = {};
var zoom_scale=1.0;

function connecthandler(e) {
    addgamepad(e.gamepad);
}

function addgamepad(gamepad) {
    controllers[gamepad.index] = gamepad;
    console.log(gamepad.id);
}

function disconnecthandler(e) {
    removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
    delete controllers[gamepad.index];
}
async function updateStatus() {
    scangamepads();
    //console.log("update");
    
    for (j in controllers) {
        var controller = controllers[j];
        for (var i=0; i<controller.buttons.length; i++) {
            var val = controller.buttons[i];
            var pressed = val == 1.0;
            var touched = false;
            if (typeof(val) == "object") {
              pressed = val.pressed;
              if ('touched' in val) {
                touched = val.touched;
              }
              val = val.value;
            }
            if(touched){
                console.log("touched ",i);
            }
            if(pressed){
                console.log("pressed ",i);
                if(i==6 && zoom_scale>0.25){
                    zoom_scale-=0.05;
                    if(val>0.7)
                    zoom_scale-=0.1;
                }
                if(i==7 &&zoom_scale<5){
                    zoom_scale+=0.05;
                    if(val>0.7)
                    zoom_scale+=0.1;
                }
                document.body.style.zoom=zoom_scale;
                console.log(zoom_scale);
                this.blur();
            }
        }
        await axes_move(controller);
    }


}

async function axes_move(controller){
    var axes_choose_y = 3;
    var axes_choose_x = 2;
    var scale_x = 0;
        var scale_y = 0;
        if (controller.axes[axes_choose_y] < -0.1) {
            scale_y = -0.1;
        } else if (controller.axes[axes_choose_y] > 0.1) {
            scale_y = 0.1;
        }
        if (controller.axes[axes_choose_y] < -0.7) {
            scale_y = -0.5;
        } else if (controller.axes[axes_choose_y] > 0.7) {
            scale_y = 0.5;
        }
        if (controller.axes[axes_choose_y] < -0.95) {
            scale_y = -1;
        } else if (controller.axes[axes_choose_y] > 0.95) {
            scale_y = 1;
        }

        if (controller.axes[axes_choose_x] < -0.1) {
            scale_x = -0.1;
        } else if (controller.axes[axes_choose_x] > 0.1) {
            scale_x = 0.1;
        }
        if (controller.axes[axes_choose_x] < -0.7) {
            scale_x = -0.5;
        } else if (controller.axes[axes_choose_x] > 0.7) {
            scale_x = 0.5;
        }
        if (controller.axes[axes_choose_x] < -0.95) {
            scale_x = -1;
        } else if (controller.axes[axes_choose_x] > 0.95) {
            scale_x = 1;
        }

        await window.scrollBy({ top: scale_y * window.innerHeight, 
            left: scale_x * window.innerWidth/10, 
            behavior: "smooth", });
    
}


function scangamepads(controller) {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
    for (var i = 0; i < gamepads.length; i++) {
        if (gamepads[i] && (gamepads[i].index in controllers)) {
            controllers[gamepads[i].index] = gamepads[i];
        }
    }
}


console.log("start!");
if (haveEvents) {
    console.log("haveEvents!");
    window.addEventListener("gamepadconnected", connecthandler);
    window.addEventListener("gamepaddisconnected", disconnecthandler);
} else if (haveWebkitEvents) {
    console.log("haveWebkitEvents!");
    window.addEventListener("webkitgamepadconnected", connecthandler);
    window.addEventListener("webkitgamepaddisconnected", disconnecthandler);
} else {
    console.log("wow!");
    setInterval(scangamepads, 500);
}
setInterval(updateStatus, 100);
