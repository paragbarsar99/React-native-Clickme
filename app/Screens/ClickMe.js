import React, {useRef, useEffect, useState, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Animated,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Svg, {Circle} from 'react-native-svg';

function TimeOut() {
  var _intervel = null;
  var _timeout = null;
  if (score === 0 && getter.start && time > 0) {
    _timeout = setTimeout(() => {
      _intervel = setInterval(() => {
        setTime(prev => prev - 1);
      }, 1000);
    }, 10000);
  } else {
    if (score > 0 || time === 0) {
      console.log(time);
      clearTimeout(_timeout), clearInterval(_intervel);
    }
  }
  return () => [clearTimeout(_timeout), clearInterval(_intervel)];
}

const ClickMe = () => {
  const {width, height} = useWindowDimensions();

  const CircleAnimate = useRef(new Animated.Value(0)).current;
  const MagicBox = useRef(new Animated.Value(width / 2)).current;
  const MagicScale = useRef(new Animated.Value(0)).current;

  const [score, setScore] = useState(0);
  const [time, setTime] = useState(10);

  const [getter, setter] = useState({
    start: false,
    timeOut: 10,
  });

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
  const AnimatableTouchable =
    Animated.createAnimatedComponent(TouchableOpacity);

  const circleRef = useRef();
  const textInputRef = useRef();
  const viewRef = useRef();

  const POINT = 50;
  const STROCK_WIDTH = 10;
  const RADIUS = 100;
  const HALF_CIRCLE = RADIUS + STROCK_WIDTH;
  const CIRCLECUMEFERENCE = 2 * Math.PI * RADIUS;
  const PERCENTAGE = 100;
  const MAXPRECENTAGE = 150;
  const MAGIC_BOX_HEIGHT = height / 3;
  const BOX_HEIGHT = 50;
  const BOX_WIDTH = 100;

  function BounceBox() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(MagicScale, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(MagicScale, {
          toValue: 0,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }

  const MagicBoxAnimate = useRef(
    Animated.loop(
      Animated.sequence([
        Animated.delay(500),
        Animated.timing(MagicBox, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(MagicBox, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ),
  );

  const animatable = toValue => {
    Animated.timing(CircleAnimate, {
      toValue,
      delay: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const BounceScale = MagicScale.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
    extrapolate: 'clamp',
  });

  const StartAnimation = () => {
    setScore(prev => prev - prev);
    setter(prev => ({...prev, start: true}));
    // setTime(10);
    MagicBoxAnimate.current.reset();
    MagicBoxAnimate.current.start();
  };

  useEffect(() => {
    //TimeOut Function was here,defind above this component
  }, [getter.start, score, time]);

  useMemo(() => {
    animatable(score);
    if (score === MAXPRECENTAGE || time === 0) {
      MagicBoxAnimate.current.reset();
      MagicBoxAnimate.current.stop();
      MagicBox.setValue(width / 2);
      setter(prev => ({...prev, start: false}));
      BounceBox();
    }
  }, [score, time]);

  const Callback = React.useCallback(() => {
    setScore(prev => prev + POINT);
  }, [setScore, score]);

  useEffect(() => {
    CircleAnimate.addListener(v => {
      if (circleRef.current) {
        const maxPercentage = (100 * v.value) / MAXPRECENTAGE;

        const Percentageof =
          CIRCLECUMEFERENCE - (maxPercentage * CIRCLECUMEFERENCE) / 100;

        circleRef.current.setNativeProps({
          strokeDashoffset: Percentageof,
        });
      }
      if (textInputRef.current) {
        textInputRef.current.setNativeProps({
          text: `Score-${Math.round(v.value)}`,
        });
      }
    });

    return () => CircleAnimate.removeAllListeners();
  }, [MAXPRECENTAGE, PERCENTAGE]);

  useEffect(() => {
    BounceBox();
    MagicBox.addListener(v => {
      const TranslateX = Math.round(Math.random() * width);
      const TranslateY = Math.round(Math.random() * MAGIC_BOX_HEIGHT);
      if (viewRef.current) {
        viewRef.current.setNativeProps({
          style: {
            transform: [
              {
                translateX: TranslateX,
              },
              {
                translateY: TranslateY,
              },
            ],
          },
        });
      }
    });
    return () => MagicBox.removeAllListeners();
  }, []);

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}>
        <Svg
          width={RADIUS * 2}
          height={RADIUS * 2}
          viewBox={`0 0 ${HALF_CIRCLE * 2} ${HALF_CIRCLE * 2}`}>
          <Circle
            cx="50%"
            cy="50%"
            r={RADIUS}
            stroke={'black'}
            strokeWidth={STROCK_WIDTH}
          />
          <AnimatedCircle
            ref={circleRef}
            cx="50%"
            cy="50%"
            r={RADIUS}
            stroke={'red'}
            strokeWidth={STROCK_WIDTH}
            strokeLinecap={'round'}
            strokeDasharray={CIRCLECUMEFERENCE}
            strokeDashoffset={CIRCLECUMEFERENCE}
          />
        </Svg>
        <AnimatedTextInput
          editable={false}
          defaultValue={'Score-0'}
          ref={textInputRef}
          style={{
            alignSelf: 'center',
            position: 'absolute',
            fontSize: RADIUS / 3,
            color: 'black',
          }}></AnimatedTextInput>
      </View>
      <View style={{flex: 1}}>
        <View
          style={{
            height: MAGIC_BOX_HEIGHT,
            borderTopColor: 'orange',
            borderTopWidth: 1,
            // marginBottom: 60,
          }}>
          {getter.start ? (
            <AnimatableTouchable
              ref={viewRef}
              activeOpacity={1}
              onPress={Callback}
              style={{
                width: 120,
                height: 60,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: 'orange',
              }}>
              <Text> {getter.start ? `CLICK ME` : `START NOW`}</Text>
            </AnimatableTouchable>
          ) : (
            <AnimatableTouchable
              activeOpacity={1}
              onPress={StartAnimation}
              style={{
                transform: [
                  {
                    scale: BounceScale,
                  },
                ],
                width: 120,
                height: 60,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: 'orange',
                alignSelf: 'center',
              }}>
              <Text> {getter.start ? `CLICK ME` : `START NOW`}</Text>
            </AnimatableTouchable>
          )}
        </View>
      </View>
    </View>
  );
};

export default ClickMe;

/* <AnimatedOpacity
          ref={OpacityRef}
          style={{
            width: BOX_WIDTH,
            height: BOX_HEIGHT,
            alignSelf: 'auto',
            borderWidth: 1,
            borderRadius: 20,
            padding: 10,
            borderColor: 'tomato',
            justifyContent: 'center',
            alignItems: 'center',
            transform: [
              {
                translateX: MagicBox.x,
              },
              // {
              //   scale: MagicScale,
              // },
            ],
          }}
          onPress={Callback}
          activeOpacity={0.8}>
          <Text style={{fontSize: 16, color: 'black'}}>Click Me</Text>
        </AnimatedOpacity> */
const styles = StyleSheet.create({});
