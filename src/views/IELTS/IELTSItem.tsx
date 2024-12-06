import { SpeakerWaveIcon } from '@heroicons/react/24/outline';
import type { IELTSWObj } from '@src/@types/IELTSType';
import { emptyFn } from '@src/constants/constants';
import { BadgeCheck } from 'lucide-react';
import { FC, MouseEvent, useState } from 'react';
import { BiShow } from 'react-icons/bi';
import { FaRegEyeSlash } from 'react-icons/fa6';
type IELTSItemProps = { ieltsW: IELTSWObj };
const IELTSItem: FC<IELTSItemProps> = ({ ieltsW }): JSX.Element => {
  const { en, en_answer } = ieltsW;
  const [enQ, setEnQ] = useState<string>('');
  const getTextString = (text: string = ''): string => {
    return (text.replace(/\s+/g, ' ') || '').toLowerCase();
  };
  const questionWords = getTextString(en);
  const [isQRight, setQRight] = useState<boolean>(true);
  const answerWords = getTextString(en_answer);
  const [enA, setEnA] = useState<string>('');
  const [isARight, setARight] = useState<boolean>(true);
  const onCheckInput = (
    value: string = '',
    compareString: string = '',
    setTextFn: React.Dispatch<React.SetStateAction<string>> = emptyFn,
    setResultFn: React.Dispatch<React.SetStateAction<boolean>> = emptyFn,
    setSucFn: React.Dispatch<React.SetStateAction<boolean>> = emptyFn,
  ) => {
    setTextFn(value);
    let result = true;
    let hasResultChanged = false;
    const valueString = getTextString(value);
    for (let i = 0; i < valueString.length; i++) {
      if (!result) break;
      if (
        (hasResultChanged && result) ||
        i > compareString.length ||
        valueString[i] !== compareString[i]
      ) {
        result = false;
        hasResultChanged = true;
      }
      setSucFn(i === compareString.length - 1);
    }
    setResultFn(result);
  };

  const onTextareaQChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onCheckInput(e.target.value || '', questionWords, setEnQ, setQRight, setHideQSuc);
  };

  const onTextareaAChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onCheckInput(e.target.value || '', answerWords, setEnA, setARight, setHideASuc);
  };

  const [hideQTip, setHideQTip] = useState(false);
  const [hideQSuc, setHideQSuc] = useState(false);
  const [hideATip, setHideATip] = useState(false);
  const [hideASuc, setHideASuc] = useState(false);

  const toggleQHide = () => {
    setHideQTip(!hideQTip);
  };
  const toggleAHide = () => {
    setHideATip(!hideATip);
  };
  const handleSpeaker = (e: MouseEvent<SVGSVGElement, globalThis.MouseEvent>, text: string) => {
    e.stopPropagation();
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
      return;
    }
    if (!speechSynthesis || !text) return;
    // https://github.com/mdn/dom-examples/blob/main/web-speech-api/speak-easy-synthesis/script.js
    speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };
  return (
    <div className="flex h-[calc(100vh-120px)] w-full flex-col items-center justify-center gap-4">
      <div className="flex w-full flex-col justify-center">
        <label htmlFor="input-q " className="mb-4 inline-block w-full" title={ieltsW.en}>
          <div
            onClick={toggleQHide}
            className={`cursor-pointer py-1 text-center ${hideQSuc ? 'text-green-600' : ''}`}
          >
            <p className="flex items-center justify-center">
              {ieltsW.zh}
              {hideQTip ? (
                <FaRegEyeSlash title="hide" className="mr-2" />
              ) : (
                <BiShow title="Show" className="mr-2" />
              )}
              <SpeakerWaveIcon
                onClick={(e) => handleSpeaker(e, ieltsW.en || '')}
                className="h-4 w-4 hover:bg-gray-200/50 hover:text-red-300"
              />
              {hideQSuc && <BadgeCheck className="ml-2 text-xl text-green-600" />}
            </p>
            {hideQTip ? <div className="font-bold">{ieltsW.en}</div> : ''}
          </div>
        </label>
        <textarea
          onChange={(e) => onTextareaQChange(e)}
          id="input-q"
          className={`textarea textarea-md h-fit min-h-[260px] w-full min-w-[400px] rounded-md border p-4 text-center shadow-md ${isQRight ? (!enQ ? 'border' : 'text-green-400') : 'text-red-400'}`}
        />
      </div>
      <div className="mt-8 flex w-full flex-col justify-center">
        <label htmlFor="input-a" className="mb-4 inline-block w-full" title={ieltsW.en_answer}>
          <div
            onClick={toggleAHide}
            className={`cursor-pointer py-1 text-center ${hideASuc ? 'text-green-600' : ''}`}
          >
            <p className="flex items-center justify-center transition-all">
              {ieltsW.zh_answer}{' '}
              {hideATip ? (
                <FaRegEyeSlash title="hide" className="mr-2" />
              ) : (
                <BiShow title="Show" className="mr-2" />
              )}
              <SpeakerWaveIcon
                onClick={(e) => handleSpeaker(e, ieltsW.en_answer || '')}
                className="h-4 w-4 hover:bg-gray-200/50 hover:text-red-300"
              />
              {hideASuc && <BadgeCheck className="ml-2 text-2xl text-green-600" />}
            </p>{' '}
            {hideATip ? <div className="font-bold transition-all">{ieltsW.en_answer}</div> : ''}
          </div>
        </label>
        <textarea
          onChange={(e) => onTextareaAChange(e)}
          id="input-a"
          className={`textarea textarea-md h-fit min-h-[260px] w-full min-w-[400px] rounded-md border p-4 text-center shadow-md ${isARight ? (!enA ? 'border' : 'text-green-400') : 'text-red-400'}`}
        />
      </div>
    </div>
  );
};

export default IELTSItem;
