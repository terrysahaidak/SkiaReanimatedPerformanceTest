import * as SK from '@shopify/react-native-skia';
import React, {useMemo} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  useWindowDimensions,
  Switch,
} from 'react-native';
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useScrollViewOffset,
  useSharedValue,
} from 'react-native-reanimated';

const BOX_HEIGHT = 80;
const PADDING = 10;
const BOX_WITH_PADDING = BOX_HEIGHT + 10;
const PAGE = 10;

const MAX_LENGTH = PAGE * 50;

const items = Array.from({length: MAX_LENGTH}, (_, i) => i);

function BoxItemSkiaREA({
  index,
  sv1,
  sv2,
  sv3,
}: {
  index: number;
  sv1: SharedValue<number>;
  sv2: SharedValue<number>;
  sv3: SharedValue<number>;
}) {
  const dimensions = useWindowDimensions();

  const width = dimensions.width - 20;

  const box = SK.rect(0, 0, width, BOX_HEIGHT);

  const transform = useDerivedValue(() => {
    return [
      {
        translateX: 10 + sv1.value + sv2.value + sv3.value,
      },
      {
        translateY:
          index * BOX_WITH_PADDING + sv1.value + sv2.value + sv3.value,
      },
    ];
  });

  const color = useDerivedValue(() => {
    const value = index + sv1.value + sv2.value + sv3.value;

    return value % 2 === 0 ? 'red' : 'blue';
  });

  const paragraph = useMemo(() => {
    const p = SK.Skia.ParagraphBuilder.Make({
      textAlign: SK.TextAlign.Center,
    })
      .pushStyle({
        color: SK.Skia.Color('white'),
        fontSize: 20,
      })
      .addText(index.toString())
      .build();

    p.layout(width);

    return p;
  }, [index, width]);

  return (
    <SK.Group transform={transform}>
      <SK.Box box={box} color={color} />
      <SK.Paragraph
        width={width}
        paragraph={paragraph}
        x={0}
        y={BOX_HEIGHT / 2 - paragraph.getHeight() / 2}
      />
    </SK.Group>
  );
}
function BoxItemSkia({index}: {index: number}) {
  const dimensions = useWindowDimensions();

  const width = dimensions.width - 20;

  const box = SK.rect(0, 0, width, BOX_HEIGHT);

  const transform = [
    {
      translateX: 10,
    },
    {
      translateY: index * BOX_WITH_PADDING,
    },
  ];

  const color = (() => {
    return index % 2 === 0 ? 'red' : 'green';
  })();

  const paragraph = useMemo(() => {
    const p = SK.Skia.ParagraphBuilder.Make({
      textAlign: SK.TextAlign.Center,
    })
      .pushStyle({
        color: SK.Skia.Color('white'),
        fontSize: 20,
      })
      .addText(index.toString())
      .build();

    p.layout(width);

    return p;
  }, [index, width]);

  return (
    <SK.Group transform={transform}>
      <SK.Box box={box} color={color} />
      <SK.Paragraph
        width={width}
        paragraph={paragraph}
        x={0}
        y={BOX_HEIGHT / 2 - paragraph.getHeight() / 2}
      />
    </SK.Group>
  );
}

function BoxItemRN({index}: {index: number}) {
  const dimensions = useWindowDimensions();

  const width = dimensions.width - 20;

  const color = (() => {
    return index % 2 === 0 ? 'red' : 'green';
  })();

  const style = {
    position: 'absolute',
    backgroundColor: color,
    transform: [
      {
        translateX: PADDING,
      },
      {
        translateY: index * BOX_WITH_PADDING,
      },
    ],
  };

  return (
    <Animated.View
      style={[
        {
          width,
          height: BOX_HEIGHT,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}>
      <Text style={{color: 'white', fontSize: 20}}>{index}</Text>
    </Animated.View>
  );
}

function BoxItemREA({
  index,
  sv1,
  sv2,
  sv3,
}: {
  index: number;
  sv1: SharedValue<number>;
  sv2: SharedValue<number>;
  sv3: SharedValue<number>;
}) {
  const dimensions = useWindowDimensions();

  const width = dimensions.width - 20;

  const color = useDerivedValue(() => {
    const value = index + sv1.value + sv2.value + sv3.value;

    return value % 2 === 0 ? 'red' : 'blue';
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      backgroundColor: color.value,
      transform: [
        {
          translateX: PADDING + sv1.value + sv2.value + sv3.value,
        },
        {
          translateY:
            index * BOX_WITH_PADDING + sv1.value + sv2.value + sv3.value,
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height: BOX_HEIGHT,
          justifyContent: 'center',
          alignItems: 'center',
        },
        animatedStyle,
      ]}>
      <Text style={{color: 'white', fontSize: 20}}>{index}</Text>
    </Animated.View>
  );
}

function RNExample({
  page,
  offset,
  useReanimated,
}: {
  page: number[];
  offset: SharedValue<number>;
  useReanimated: boolean;
}) {
  const sv1 = useSharedValue(0);
  const sv2 = useSharedValue(0);
  const sv3 = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -offset.value,
        },
      ],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      {page.map(index =>
        useReanimated ? (
          <BoxItemREA sv1={sv1} sv2={sv2} sv3={sv3} key={index} index={index} />
        ) : (
          <BoxItemRN key={index} index={index} />
        ),
      )}
    </Animated.View>
  );
}

function SkiaExample({
  page,
  offset,
  useReanimated,
}: {
  page: number[];
  offset: SharedValue<number>;
  useReanimated: boolean;
}) {
  const sv1 = useSharedValue(0);
  const sv2 = useSharedValue(0);
  const sv3 = useSharedValue(0);

  const transform = useDerivedValue(() => {
    return [
      {
        translateY: -offset.value,
      },
    ];
  });

  return (
    <SK.Canvas
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}>
      <SK.Group transform={transform}>
        {page.map(index =>
          useReanimated ? (
            <BoxItemSkiaREA
              sv1={sv1}
              sv2={sv2}
              sv3={sv3}
              key={index}
              index={index}
            />
          ) : (
            <BoxItemSkia key={index} index={index} />
          ),
        )}
      </SK.Group>
    </SK.Canvas>
  );
}

function App(): React.JSX.Element {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [useSkia, setUseSkia] = React.useState(true);
  const [useReanimated, setUseReanimated] = React.useState(true);

  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollViewRef);

  useAnimatedReaction(
    () => {
      return Math.max(
        1,
        Math.floor(scrollOffset.value / (BOX_WITH_PADDING * PAGE)) + 1,
      );
    },
    (nextPage, prevPage) => {
      if (nextPage !== prevPage) {
        runOnJS(setPageIndex)(nextPage);
      }
    },
    [pageIndex],
  );

  const pageItems = useMemo(() => {
    return items.slice((pageIndex - 1) * PAGE, (pageIndex + 1) * PAGE);
  }, [pageIndex]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'center',
          margin: 20,
        }}>
        <Text style={{fontSize: 20, marginRight: 20}}>Use Skia</Text>
        <Switch onValueChange={setUseSkia} value={useSkia} />
        <Text style={{fontSize: 20, marginRight: 20}}>Use Reanimated</Text>
        <Switch onValueChange={setUseReanimated} value={useReanimated} />
      </View>

      <View
        style={{
          height: PAGE * BOX_WITH_PADDING,
          overflow: 'hidden',
        }}>
        {useSkia ? (
          <SkiaExample
            useReanimated={useReanimated}
            page={pageItems}
            offset={scrollOffset}
          />
        ) : (
          <RNExample
            useReanimated={useReanimated}
            page={pageItems}
            offset={scrollOffset}
          />
        )}

        <Animated.ScrollView
          ref={scrollViewRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}>
          <View style={{height: 100 * PAGE * BOX_WITH_PADDING}} />
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default App;
