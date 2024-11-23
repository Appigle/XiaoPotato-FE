import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Dialog,
  DialogBody,
  Input,
} from '@material-tailwind/react';
import {
  Archive,
  Badge,
  ChevronLeft,
  Clock,
  MoreVertical,
  Pencil,
  Printer,
  RefreshCw,
  Reply,
  Share,
  Star,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface Email {
  id: string;
  from: string;
  to: string;
  email: string;
  subject: string;
  content: string;
  date: string;
  labels?: string[];
}

const mockEmails: Email[] = [
  {
    id: '1',
    from: 'no-reply@conestoga',
    to: 'lchen5274@conestogac.on.ca',
    email: 'no-reply@conestoga.desire2learn.com',
    subject: 'INFO8106-24F-Sec3-System Development Project - Feedback',
    content: `Feedback for "Meeting Minutes and Agendas" has been updated\n\nAccess "Meeting Minutes and Agendas"\n\nINFO8106-24F-Sec3-System Development Project\n\nYou are receiving this message because you subscribed to receive instant notifications via email.`,
    date: '13:37',
    labels: ['Inbox', 'Conestoga'],
  },
  {
    id: '2',
    from: 'ray001.chen',
    to: 'lchen5274@conestogac.on.ca',
    email: 'ray001.chen@xiaopotato.top',
    subject: 'I LOVE YOU',
    content: 'TEST HELLO WORLD!',
    date: '11:33',
    labels: ['Inbox'],
  },
];

const EmailDetail = ({
  email,
  onClose,
}: {
  email: Email;
  onClose: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => (
  <Dialog open={false} handler={() => {}}>
    <DialogBody className="flex h-[80vh] max-w-4xl flex-col">
      <div className="flex items-center justify-between border-b p-2">
        <div className="flex items-center space-x-2">
          <Button variant="filled" size="md" onClick={onClose}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Archive className="h-5 w-5 cursor-pointer" />
          <Trash2 className="h-5 w-5 cursor-pointer" />
          <Clock className="h-5 w-5 cursor-pointer" />
        </div>
        <div className="flex items-center space-x-2">
          <Printer className="h-5 w-5 cursor-pointer" />
          <MoreVertical className="h-5 w-5 cursor-pointer" />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="mb-2 text-xl font-semibold">{email.subject}</h1>
            <div className="flex space-x-2">
              {email.labels?.map((label) => <Badge key={label}>{label}</Badge>)}
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
                {email.from[0].toUpperCase()}
              </div>
              <div>
                <div className="font-medium">{email.from}</div>
                <div className="text-sm text-gray-600">to {email.to}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <span>{email.date}</span>
              <Star className="h-5 w-5 cursor-pointer" />
              <MoreVertical className="h-5 w-5 cursor-pointer" />
            </div>
          </div>

          <div className="whitespace-pre-wrap text-gray-800">{email.content}</div>
        </div>
      </div>

      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Button className="flex items-center space-x-2">
            <Reply className="h-4 w-4" />
            <span>Reply</span>
          </Button>
          <Button variant="outlined" className="flex items-center space-x-2">
            <Share className="h-4 w-4" />
            <span>Forward</span>
          </Button>
        </div>
      </div>
    </DialogBody>
  </Dialog>
);

const GmailApp = () => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  return (
    <div className="flex h-screen bg-gray-100">
      <Card className="h-full w-64 rounded-none">
        <CardBody className="p-4">
          <Button className="mb-4 flex w-full items-center gap-2">
            <Pencil className="h-4 w-4" /> Compose
          </Button>

          <div className="space-y-1">
            {[
              { name: 'Inbox', count: 13 },
              { name: 'Starred', count: 0 },
              { name: 'Sent', count: 0 },
              { name: 'Drafts', count: 3 },
            ].map((item) => (
              <div
                key={item.name}
                className="flex cursor-pointer items-center rounded-md px-3 py-2 hover:bg-gray-100"
              >
                <span>{item.name}</span>
                {item.count > 0 && <Badge className="ml-auto">{item.count}</Badge>}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="flex-1 p-4">
        <Card>
          <CardHeader className="p-4">
            <div className="flex items-center gap-4">
              <Input crossOrigin="" placeholder="Search mail" className="max-w-lg" />
              <Button variant="filled" size="sm">
                <RefreshCw className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-1">
              {mockEmails.map((email) => (
                <div
                  key={email.id}
                  className="flex cursor-pointer items-center rounded-md p-2 hover:bg-gray-50"
                  onClick={() => setSelectedEmail(email)}
                >
                  <Button variant="filled" size="sm" className="h-8 w-8">
                    <Star className="h-4 w-4" />
                  </Button>
                  <div className="mx-2 min-w-0 flex-1">
                    <div className="font-medium">{email.from}</div>
                    <div className="flex items-center gap-2">
                      {email.labels?.map((label) => (
                        <Badge key={label} className="text-xs">
                          {label}
                        </Badge>
                      ))}
                    </div>
                    <div className="truncate text-sm text-gray-500">{email.subject}</div>
                  </div>
                  <span className="text-sm text-gray-500">{email.date}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {selectedEmail && (
        <EmailDetail
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
          open={false}
          setOpen={() => {}}
        />
      )}
    </div>
  );
};

export default GmailApp;
