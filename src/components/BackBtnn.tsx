import { useGoBack } from '@src/utils/hooks/nav';

const BackBtnn = ({ cls }: { cls?: string }) => {
  const goBack = useGoBack();
  return (
    <>
      <div
        className={`absolute left-4 top-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white/80 p-1 text-blue-gray-900 hover:bg-gray-200 ${cls}`}
        onClick={() => goBack()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
          />
        </svg>
      </div>
    </>
  );
};
export default BackBtnn;
