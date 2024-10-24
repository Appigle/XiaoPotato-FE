import { useRef, useState } from 'react';
import './index.css';
interface HeartEffectProps {
  height?: number;
  width?: number;
  checked?: boolean;
  onChange?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
}
const HeartEffect = ({
  height = 100,
  width = 100,
  checked = false,
  onChange,
}: HeartEffectProps) => {
  const size = Math.max(Math.min(height, width), 10);
  const containerStyles = {
    height: `${height}px`,
    width: `${width}px`,
    position: 'relative',
    margin: `${(size / 4) * -1}px`,
  } as React.CSSProperties;

  const [isChecked] = useState(checked);
  const labelRef = useRef<HTMLLabelElement>(null);
  const [isInitial, setIsInitial] = useState(true);

  const [labelStyles, setLabelStyles] = useState<React.CSSProperties>(() => {
    return isChecked
      ? {
          backgroundPosition: 'right',
        }
      : {};
  });

  const onChangeCb = (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => {
    if (labelRef.current) {
      labelRef.current.setAttribute('data-initial', '1');
    }
    isInitial && setLabelStyles({});
    setIsInitial(false);
    onChange?.(checked, e);
  };

  const IDRef = useRef(`ID_${Math.random() * 100}`);
  return (
    <div style={containerStyles}>
      <input
        type="checkbox"
        name="cbBox"
        id={IDRef.current}
        className="cbBox_love"
        defaultChecked={isChecked}
        onChange={(e) => onChangeCb(e.target.checked, e)}
      />
      <label
        title={`${isChecked}`}
        className="cbBox-love"
        htmlFor={IDRef.current}
        style={{ ...labelStyles, width: width, height: height }}
        ref={labelRef}
        data-initial={0}
      ></label>
    </div>
  );
};
export default HeartEffect;
