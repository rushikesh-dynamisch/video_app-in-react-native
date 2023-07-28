// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import React from 'react';
// import type {PropsWithChildren} from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';
// import Constants from 'expo-constants';

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

// function Section({children, title}: SectionProps): JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// }

// function App(): JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };
//   console.log(Constants.systemFonts);
//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         <Header />
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//           }}>
//           <Section title="Step One">
//             Edit <Text style={styles.highlight}>App.tsx</Text> to change this
//             screen and then come back to see your edits.
//           </Section>
//           <Section title="See Your Changes">
//             <ReloadInstructions />
//           </Section>
//           <Section title="Debug">
//             <DebugInstructions />
//           </Section>
//           <Section title="Learn More">
//             Read the docs to discover what to do next:
//           </Section>
//           <LearnMoreLinks />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

// export default App;
import { StatusBar } from 'expo-status-bar';
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



return (
  <View style={{flex:1}}>
    <Text style={{fontSize:20,marginLeft:100}}>Diseas Detector</Text>
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
            </View>
   <View style={styles.buttons}>
   {/* <Button 
      title ={status.isPlaying ?'pause' :'play'}
      onPress ={()=>
      status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
      }
      /> */}
      </View>
      {/* <Button
      title='flip Video'
      onPress ={()=>{
        setType(
          type ==camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
        );
      }}
      /> */}
      
      {/* <Button title="LiveStream" onPress={()=>liveStream()} /> */}

             

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
      width: 80,
      height: 50,
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
});
