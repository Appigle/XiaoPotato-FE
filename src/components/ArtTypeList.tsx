import ALL_ART_TYPES from '@src/constants/ArtTypes';
import useGlobalStore from '@src/stores/useGlobalStore';
import { useCallback, useEffect, useState } from 'react';
import HorizontalList from './HorizontalList';

// ArtTypeList component
const ArtTypeList: React.FC<{ scrollTop: number }> = ({ scrollTop }) => {
  const calcOpacity = useCallback(() => {
    return Math.min(0.8, scrollTop / 60);
  }, [scrollTop]);

  const [opacity, setOpacity] = useState(calcOpacity());
  const [activeStyle, setActiveStyle] = useState({});
  const [inActiveStyle, setInActiveStyle] = useState({});
  const [textStyle, setTextStyle] = useState({});

  const style = {
    background: `rgba(255, 255, 255, ${opacity})`,
    color: `rgba(0, 0, 0, ${opacity})`,
  };

  const { currentArtType = 'All', setCurrentArtType, isDarkMode } = useGlobalStore();

  useEffect(() => {
    setOpacity(calcOpacity());
    // 0~0.5 -> bg-> transparent~0.5 text -> black 0~0.5
    // 0.5~1 -> bg-> 0.5~1 text -> black 0.5~1
    let color = !isDarkMode ? `rgba(0, 0, 0, ${opacity})` : `rgba(0, 0, 0, ${opacity})`;
    if (opacity <= 0.5) {
      color = isDarkMode ? `rgba(255, 255, 255, ${1 - opacity})` : `rgba(0,0,0, ${1 - opacity})`;
    }
    setActiveStyle({});
    setInActiveStyle({});
    setTextStyle({ color });
  }, [opacity, calcOpacity, isDarkMode]);

  const items = ALL_ART_TYPES.map((m) => ({
    id: m.name,
    content: (
      <span className="whitespace-nowrap">
        {m.emoji} {m.name}
      </span>
    ),
  }));

  return (
    <div className="sticky top-0 z-10 mt-4" style={style}>
      <HorizontalList
        items={items}
        activeId={currentArtType}
        activeStyle={activeStyle}
        inActiveStyle={inActiveStyle}
        textStyle={textStyle}
        onItemClick={(id) => {
          setCurrentArtType(id);
        }}
        className="my-4 flex-1"
      />
    </div>
  );
};

export default ArtTypeList;
