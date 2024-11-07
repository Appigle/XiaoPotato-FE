import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';

const KeyPressNotice = (props: {
  top?: string;
  left?: string;
  containerStyle?: React.CSSProperties;
  kbdCls?: string;
  showTime?: number;
  enable?: boolean;
  customKeyEmojiMap?: { [key: string]: string };
}) => {
  const {
    top = '75%',
    left = '0',
    containerStyle,
    kbdCls,
    showTime = 500,
    customKeyEmojiMap,
    enable = true,
  } = props;

  // https://lingojam.com/TextToEmojiLetters
  const [KEY_EMOJI] = useState<{ [key: string]: string }>({
    KeyA: '🅰',
    KeyB: '🅱',
    KeyC: '🅲',
    KeyD: '🅳',
    KeyE: '🅴',
    KeyF: '🅵',
    KeyG: '🅶',
    KeyH: '🅷',
    KeyI: '🅸',
    KeyJ: '🅹',
    KeyK: '🅺',
    KeyL: '🅻',
    KeyM: '🅼',
    KeyN: '🅽',
    KeyO: '🅾',
    KeyP: '🅿',
    KeyQ: '🆀',
    KeyR: '🆁',
    KeyS: '🆂',
    KeyT: '🆃',
    KeyU: '🆄',
    KeyV: '🆅',
    KeyW: '🆆',
    KeyX: '🆇',
    KeyY: '🆈',
    KeyZ: '🆉',
    Digit0: '0️⃣',
    Digit1: '1️⃣',
    Digit2: '2️⃣',
    Digit3: '3️⃣',
    Digit4: '4️⃣',
    Digit5: '5️⃣',
    Digit6: '6️⃣',
    Digit7: '7️⃣',
    Digit8: '8️⃣',
    Digit9: '9️⃣',
    Enter: '↵',
    Space: '␣',
    Backspace: '⌫',
    Tab: '⇥',
    ShiftLeft: '⇧',
    ControlLeft: '⌃',
    AltLeft: '⌥',
    MetaLeft: '⌘',
    ArrowUp: '↑',
    ArrowDown: '↓',
    ArrowLeft: '←',
    ArrowRight: '→',
    CapsLock: '⇪',
    PageUp: '⇞',
    PageDown: '⇟',
    Home: '🏠',
    End: '🔚',
    Insert: 'Ins',
    Delete: 'Del',
    F1: 'F1',
    F2: 'F2',
    F3: 'F3',
    F4: 'F4',
    F5: 'F5',
    F6: 'F6',
    F7: 'F7',
    F8: 'F8',
    F9: 'F9',
    F10: 'F10',
    F11: 'F11',
    F12: 'F12',
    NumLock: 'Num Lock',
    Numpad0: '0️⃣',
    Numpad1: '1️⃣',
    Numpad2: '2️⃣',
    Numpad3: '3️⃣',
    Numpad4: '4️⃣',
    Numpad5: '5️⃣',
    Numpad6: '6️⃣',
    Numpad7: '7️⃣',
    Numpad8: '8️⃣',
    Numpad9: '9️⃣',
    NumpadAdd: '+',
    NumpadSubtract: '-',
    NumpadMultiply: '×',
    NumpadDivide: '÷',
    NumpadDecimal: '.',
    ...customKeyEmojiMap,
  });
  const [keys, setKeys] = useState<KeyboardEvent[]>([]);
  const [isPwdInputFocused, setIsPwdInputFocused] = useState(false);

  const [isDown, setIsDown] = useState(false);
  const timerRef = useRef(0);
  const clear = useCallback(() => {
    if (isDown || keys.length === 0) return;
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setKeys([]);
    }, showTime - 500);
  }, [isDown, showTime, keys]);

  const dcClear = useDebounceCallback(clear, 500);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!enable) return;
      setIsDown(true);
      setKeys((prevKeys) => [...prevKeys, e]);
    };

    const handleKeyUp = () => {
      setIsDown(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    dcClear();
  }, [dcClear, keys]);

  useEffect(() => {
    const handleFocus = () => {
      setIsPwdInputFocused(true);
    };

    const handleBlur = () => {
      setIsPwdInputFocused(false);
    };
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
              if (!(node as HTMLElement).querySelectorAll) return;
              (node as HTMLElement).querySelectorAll('input[type="password"]').forEach((input) => {
                input.addEventListener('focus', handleFocus);
                input.addEventListener('blur', handleBlur);
              });
            });
          }
          if (mutation.removedNodes.length > 0) {
            mutation.removedNodes.forEach((node) => {
              if (!(node as HTMLElement).querySelectorAll) return;
              (node as HTMLElement).querySelectorAll('input[type="password"]').forEach((input) => {
                input.removeEventListener('focus', handleFocus);
                input.removeEventListener('blur', handleBlur);
              });
            });
          }
        }
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    const inputs: HTMLInputElement[] = [];
    document.querySelectorAll('input[type="password"]').forEach((input) => {
      inputs.push(input as HTMLInputElement);
    });

    inputs.forEach((input) => {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    });

    return () => {
      inputs?.forEach((input) => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      });
    };
  }, []);

  return (
    <>
      {enable && !isPwdInputFocused && keys.length > 0 && (
        <div
          className={`absolute z-20 flex h-16 w-full items-center justify-center gap-4 overflow-auto bg-transparent`}
          style={{ top, left, ...containerStyle }}
        >
          {keys.map((key, index) => {
            return (
              <div
                key={`${index}-${key}`}
                className={`inset-0 flex h-16 w-fit min-w-16 items-center justify-center rounded-lg bg-gray-900 p-2 text-2xl font-bold text-white opacity-75 ${kbdCls}`}
              >
                {KEY_EMOJI[key.code] ? (
                  <span className="emoji-key text-4xl">{KEY_EMOJI[key.code]}</span>
                ) : (
                  key.key
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default KeyPressNotice;
