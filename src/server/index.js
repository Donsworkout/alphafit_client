const express = require('express');
const os = require('os');
const app = express();
const Kinect2 = require('kinect2');
const kinect = new Kinect2();
const axios = require('axios')

let recordData = ""
const server = app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${process.env.PORT || 3000}!`));
const io = require('socket.io').listen(server);

app.use(express.static('dist'));

if(kinect.open()) {
    console.log("kinect ready to operate");

    // 클라이언트 소켓으로 녹화된 bodyFrame 송신 
    kinect.on('bodyFrame', function(bodyFrame){
        io.sockets.emit('bodyFrame', bodyFrame);

         // 녹화 버튼 클릭 (20초간 스쿼트 동작 녹화)
        app.get('/api/startRecord', (req, res) =>  {
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
            //close the kinect after 5 seconds
            setTimeout(function(){
                kinect.removeAllListeners('bodyFrame');
                kinect.close();
                console.log("Kinect Closed");
                recordData = recordData.substring(0, recordData.length - 1);

                axios.post('http://172.30.1.56:5000/analyze_raw', {
                    data: recordData
                })
                .then((res) => {
                    console.log(res.data)
                })
                .catch((error) => {
                    console.error(error)
                })
                
            }, 20000);            
        });
	});

    kinect.openBodyReader();
}

