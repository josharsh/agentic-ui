import React, { useEffect, useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Dialog, Flex, IconButton } from '@radix-ui/themes';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  maxWidth?: string;
  maxHeight?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, maxWidth = '80vw', maxHeight = '80vh' }) => {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Content style={{ 
          maxWidth: maxWidth,
          width: maxWidth, 
          height: maxHeight, 
          margin: 'auto',
          padding: '20px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)'
        }}>
        <Flex justify="between" align="center">
          {title && <Dialog.Title>{title}</Dialog.Title>}
          <IconButton size="1" variant="ghost" color="gray" onClick={handleClose}>
            <Cross2Icon />
          </IconButton>
        </Flex>

        <div className="mt-4">{children}</div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default Modal;