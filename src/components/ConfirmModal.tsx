import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from '@material-tailwind/react';
import { useEffect, useState } from 'react';

type ConfirmModalProps = {
  open: boolean;
  title: string;
  content?: string | JSX.Element;
  confirmText: string;
  cancelText: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const ConfirmModal = (props: ConfirmModalProps) => {
  const {
    open: _open,
    title,
    content,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
  } = props;
  const [open, setOpen] = useState(_open);
  useEffect(() => {
    setOpen(_open);
  }, [_open]);
  const handleOpen = (_: boolean) => {
    console.log('%c [ _ ]-21', 'font-size:13px; background:pink; color:#bf2c9f;', _);
    setOpen(!open);
  };
  const onHandleCancel = () => {
    onCancel?.();
  };
  const onHandleConfirm = () => {
    onConfirm?.();
  };
  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>
        <Typography variant="h5" color="blue-gray">
          {title}
        </Typography>
      </DialogHeader>
      <DialogBody divider className="grid place-items-center gap-4">
        <Typography color="red" variant="h4">
          {content}
        </Typography>
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button variant="text" color="blue-gray" onClick={onHandleCancel}>
          {cancelText}
        </Button>
        <Button variant="gradient" onClick={onHandleConfirm}>
          {confirmText}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmModal;
