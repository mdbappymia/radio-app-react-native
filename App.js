import NetInfo from '@react-native-community/netinfo';
import React, {useEffect, useState} from 'react';
import {Alert, BackHandler, Image, StyleSheet, View} from 'react-native';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/FontAwesome';
Sound.setCategory('Playback');
const radioLink = 'http://node-32.zeno.fm/h7n8ug96eeruv';

var audio = new Sound(radioLink, null, error => {
  if (error) {
    return;
  } else {
    // console.log('ok');
    // setIsLoad(false);
  }
});

const App = () => {
  const [isPlay, setIsPlay] = useState(false);
  const [netState, setNetState] = useState(false);

  useEffect(() => {
    NetInfo.fetch().then(state => {
      setNetState(state.isConnected);
    });
    audio.setVolume(0.1);
    return () => {
      audio.release();
    };
  }, []);
  const playPause = () => {
    if (audio.isPlaying()) {
      audio.pause();
      setIsPlay(false);
    } else {
      setIsPlay(true);
      audio.play(success => {
        if (!netState) {
          Alert.alert('', 'Please Check your connection', [
            {},
            {text: 'OK', onPress: () => BackHandler.exitApp()},
          ]);
        }
        if (success) {
          setIsPlay(false);
          // console.log('successfully finished playing');
        } else {
          setIsPlay(false);
          // console.log('playback failed due to audio decoding errors');
          Alert.alert('', 'Please Wait', [
            {},
            {
              text: 'OK',
              onPress: () => {
                setIsPlay(true);
                audio.play(p => {
                  setIsPlay(false);
                });
              },
            },
          ]);
        }
      });
    }
  };

  return (
    <View style={styles.home}>
      <View>
        <Image
          style={{...styles.logo}}
          source={{
            uri: 'https://liveonlineradio.net/wp-content/uploads/2010/10/abc-radio-1-220x108.jpg',
          }}
        />
      </View>

      <View>
        {isPlay === true ? (
          <Icon.Button
            backgroundColor={'transparent'}
            color={'red'}
            name="pause-circle-o"
            onPress={playPause}
            size={70}
          />
        ) : (
          <Icon.Button
            backgroundColor={'transparent'}
            color={'red'}
            name="play-circle-o"
            onPress={playPause}
            size={70}
          />
        )}
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  home: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 100,
    borderRadius: 9999,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});
