const express = require('express');
const os = require('os');
const app = express();
const Kinect2 = require('kinect2');
const kinect = new Kinect2();

let recordData = ""

app.use(express.static('dist'));

app.get('/api/startRecord', (req, res) =>  {
    console.log("kinect record started");
    if(kinect.open()) {
        console.log("Kinect Opened");
        kinect.on('bodyFrame', function(bodyFrame){
            for(var i = 0;  i < bodyFrame.bodies.length; i++) {
                if(bodyFrame.bodies[i].tracked) {
                    for(var j = 0;  j < bodyFrame.bodies[i].joints.length; j++) {
                        recordData += bodyFrame.bodies[i].joints[j]["depthX"] * 512
                        recordData += ","
                        recordData += bodyFrame.bodies[i].joints[j]["depthY"] * 424
                        recordData += ","
                        recordData += bodyFrame.bodies[i].joints[j]["cameraZ"]
                        recordData += ","
                    }	
                    recordData = recordData.substring(0, recordData.length - 1);	
                    recordData += "\n"
                }
            }
        });

        //request body frames
	    kinect.openBodyReader();
    }
});

app.get('/api/stopRecord', (req, res) => {
    kinect.close();
    recordData = recordData.substring(0, recordData.length - 1);
    console.log(recordData)
    console.log("Kinect Closed");
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
