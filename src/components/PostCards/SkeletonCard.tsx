import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from '@material-tailwind/react';

export function SkeletonCard() {
  return (
    <Card className="mt-6 w-full animate-pulse rounded-xl bg-gray-500/80">
      <CardHeader
        shadow={false}
        floated={false}
        className="relative m-0 grid h-56 place-items-center rounded-b-none bg-gray-300/60"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-12 w-12 text-gray-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      </CardHeader>
      <CardBody>
        <Typography as="div" variant="h1" className="w-ful mb-4 h-3 rounded-full bg-gray-300/80">
          &nbsp;
        </Typography>
        <Typography
          as="div"
          variant="paragraph"
          className="mb-2 h-2 w-full rounded-full bg-gray-300/80"
        >
          &nbsp;
        </Typography>
        <Typography
          as="div"
          variant="paragraph"
          className="mb-2 h-2 w-full rounded-full bg-gray-300/80"
        >
          &nbsp;
        </Typography>
        <Typography
          as="div"
          variant="paragraph"
          className="mb-2 h-2 w-full rounded-full bg-gray-300/80"
        >
          &nbsp;
        </Typography>
        <Typography
          as="div"
          variant="paragraph"
          className="mb-2 h-2 w-full rounded-full bg-gray-300/80"
        >
          &nbsp;
        </Typography>
      </CardBody>
      <CardFooter className="g-4 flex items-center justify-between pt-0">
        <div className="flex items-center justify-center gap-4">
          <div className="h-8 w-8 rounded-full bg-gray-300/80 shadow-none hover:shadow-none"></div>
          <Button
            disabled
            tabIndex={-1}
            className="h-8 w-20 bg-gray-300/80 shadow-none hover:shadow-none"
          >
            &nbsp;
          </Button>
        </div>

        <div className="flex items-center justify-center">
          <Button
            disabled
            tabIndex={-1}
            className="h-8 w-4 bg-gray-300/80 shadow-none hover:shadow-none"
          >
            &nbsp;
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
