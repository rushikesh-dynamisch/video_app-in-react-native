
// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Button,Image,Dimensions, TouchableOpacity,TextInput } from 'react-native';
import React,{useState,useEffect} from 'react';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import Voice from '@react-native-community/voice';

export default function App() {
  const[hasAudioPermission,setHasAudioPermission] =useState(null);
  const[hasCameraPermission,setHasCameraPermission] =useState(null);
  const[camera,setCamera]=useState(null);
  const [record,setRecord]= useState(null);
  const [type,setType]=useState(Camera.Constants.Type.front);
  const video = React.useRef(null);
  const [status,setStatus]= React.useState({});
  const[liveVideo,setLiveVideo]=useState(true);
  const [result, setResult] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [disease, setDisease] = useState('');

useEffect(()=>{
(async ()=> {
  const cameraStatus =await Camera.requestCameraPermissionsAsync();
  setHasCameraPermission(cameraStatus.status ='granted');

  const audioStatus =await Camera.requestMicrophonePermissionsAsync();
  setHasAudioPermission(audioStatus.status ='granted');

})();
},[]);

useEffect(() => {
  Voice.onSpeechStart = speechStartHandler;
  Voice.onSpeechEnd = speechEndHandler;
  Voice.onSpeechResults = speechResultsHandler;
  return () => {
    Voice.destroy().then(Voice.removeAllListeners);
  };
}, []);


const speechStartHandler = e => {
  console.log('speechStart successful', e);
};

const speechEndHandler = e => {
  setLoading(false);
  console.log('stop handler', e);
};

const speechResultsHandler = e => {
  const text = e.value[0];
  setResult(text);
};

const startRecording = async () => {
  setLoading(true);
  try {
    await Voice.start('en-Us');
  } catch (error) {
    console.log('error', error);
  }
};

const stopRecording = async () => {
  try {
    await Voice.stop();
    setLoading(false);
  } catch (error) {
    console.log('error', error);
  }
};

const clear = () => {
  setResult('');
};

const takeVideo =async ()=>
{
  if(camera){
    const data = await camera.recordAsync({
      maxDuration:10
    })
    setRecord(data.uri);
    console.log('uri is',data.uri);
  }
}

const stopVideo = async ()=>
{
  camera.stopRecording();
  // Camera.stopRecording();
}
if(hasCameraPermission == null || hasAudioPermission==null)
{
  return <View />;
}

if(hasCameraPermission==false || hasAudioPermission==false){
  return <Text>No access to camera</Text>
}

const liveStream =()=>
{
  console.log('live streaming');
  setLiveVideo(false);
  startRecording();
}

const StopCamera =()=>
{
  console.log('live streaming');
  setLiveVideo(true);
}

const requestOptions = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: result })
};

const DetectDisease = async () => {
  try {
    await fetch(
      'https://c590-2401-4900-52fb-cdd6-14a3-b712-673d-f10b.ngrok-free.app/human_disease_detection', requestOptions)
      .then(response => {
        response.json()
          .then(data => {
            setDisease(data);
          });
      })
  }
  catch (error) {
    console.error(error);
  }
}

return (
  <View style={{flex:1}}>
    <Text style={{fontSize:20,marginLeft:100}}>Disease Detector</Text>
  <View style={styles.cameraContainer}>
      
  {(liveVideo==false?
    <Camera
   ref ={ref=>setCamera(ref)}
   style={styles.fixedRatio}
   type ={type}
   ration ={'4.3'}
   />
   :
   <Image source={require('./images/human2.jpg')} style={styles.images} />
  )
  } 
    </View>
    <Video
    ref ={video}
    style ={styles.video}
    source ={{
      uri :record,
    }}
    useNativeControls
    resizeMode ='contain'
    isLooping
    onPlaybackStatusUpdate={status =>setStatus(()=>status)}
    />
   
      <TextInput
            value={result}
            multiline={true}
            placeholder="say something!"
            style={{
              flex: 1,
              height: '100%',
            }}
            onChangeText={text => setResult(text)}
          />

            <TouchableOpacity onPress={DetectDisease} style={styles.Disease}>
              <Text>Disease</Text>
            </TouchableOpacity>
            <View style={styles.diseasetxt}>
            {disease ? <Text style={styles.disease}>You may suffer from {disease.data.NaiveBayes}</Text> : <Text style={styles.disease}>You may suffer from...</Text>}
            </View>
    <View style={styles.buttons}>
             <TouchableOpacity
              onPress={liveStream}
              style={styles.btnSection}>
             <Text>Start</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={StopCamera}
              style={styles.btnSection}>
             <Text>Pause</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={startRecording} style={styles.btnSection}>
              <Text>Speak</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={clear} style={styles.btnSection}>
              <Text>Clear</Text>
            </TouchableOpacity>
            </View>
    </View>
);
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection:'row',
    },

    fixedRatio : {
      flex:1,
      aspectRatio:1
    },
    video :{
      alignSelf :'center',
      width:350,
      height:220
    },
    buttons :{
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center'
    },
    images: {
      width: Dimensions.get('screen').width,
      height: 300,
      borderColor: 'black',
      borderWidth: 1,
      marginHorizontal: 3,
      
    },
    btnSection: {
      width: 50,
      height: 30,
      backgroundColor: '#9FE2BF',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 3,
      marginBottom: 15,
      margin:13
    },
    speak: {
      backgroundColor: 'black',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8,
      borderRadius: 8,
    },
    Disease: {
      width: 80,
      height: 40,
      backgroundColor:'#9FE2BF',
      borderRadius: 3,
      marginBottom: 100,
       marginLeft:130,
      alignItems: 'center',
      justifyContent: 'center',
    },
    disease:{
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      color:'black',
      fontSize:20,
      margin:25    
    },
    diseasetxt:{
      display:'flex',
      justifyContent:'center',
      alignItems:'center'
    }
});
