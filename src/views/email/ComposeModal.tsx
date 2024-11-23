import { Button, Input } from '@material-tailwind/react';
import {
  Bold,
  Image,
  Italic,
  Link,
  Maximize2,
  Minus,
  MoreVertical,
  Paperclip,
  Smile,
  Underline,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface ComposeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComposeDialog = ({ isOpen, onClose }: ComposeDialogProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [email, setEmail] = useState({
    to: '',
    subject: '',
    content: '',
  });

  if (!isOpen) return null;

  return (
    <div
      className={`fixed ${isExpanded ? 'inset-4' : 'bottom-0 right-4 w-[600px]'} rounded-t-lg bg-white shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center justify-between rounded-t-lg bg-gray-100 p-2">
        <span className="font-medium">New Message</span>
        <div className="flex items-center space-x-2">
          <Button variant="filled" size="md" onClick={() => setIsExpanded(!isExpanded)}>
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button variant="filled" size="md">
            <Minus className="h-4 w-4" />
          </Button>
          <Button variant="filled" size="md" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b">
            <Input
              crossOrigin=""
              placeholder="To"
              className="border-0 focus:ring-0"
              value={email.to}
              onChange={(e) => setEmail((prev) => ({ ...prev, to: e.target.value }))}
            />
            <span className="cursor-pointer text-sm text-gray-600">Cc Bcc</span>
          </div>

          <Input
            crossOrigin=""
            placeholder="Subject"
            className="border-0 border-b focus:ring-0"
            value={email.subject}
            onChange={(e) => setEmail((prev) => ({ ...prev, subject: e.target.value }))}
          />

          <textarea
            className="min-h-[300px] w-full resize-none outline-none"
            placeholder="Compose email..."
            value={email.content}
            onChange={(e) => setEmail((prev) => ({ ...prev, content: e.target.value }))}
          />
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <Button>Send</Button>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 rounded border p-1">
              <Button variant="filled" size="sm">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="filled" size="sm">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="filled" size="sm">
                <Underline className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="filled" size="sm">
              <Link className="h-4 w-4" />
            </Button>
            <Button variant="filled" size="sm">
              <Image className="h-4 w-4" />
            </Button>
            <Button variant="filled" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="filled" size="sm">
              <Smile className="h-4 w-4" />
            </Button>
            <Button variant="filled" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeDialog;
