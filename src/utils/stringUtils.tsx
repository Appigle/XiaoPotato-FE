export type FormattedWord = string | JSX.Element;
const formatStringWithTagAndUrl = (text: string): FormattedWord => {
  if (!text) return '';
  return text
    .split(/(\s+)/)
    .map((word, index) => {
      if (word.startsWith('#')) {
        return (
          <span
            key={index}
            className="rounded bg-blue-100 px-1 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
          >
            {word}
          </span>
        );
      } else if (word.match(/^(https?:\/\/[^\s]+)/)) {
        return (
          <a
            key={index}
            href={word}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-300"
          >
            {word}
          </a>
        );
      }
      return word;
    })
    .join(' ');
};

export { formatStringWithTagAndUrl };
