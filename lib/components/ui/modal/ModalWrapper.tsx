import * as Dialog from '@radix-ui/react-dialog';
import CloseButton from '../buttons/CloseButton.tsx';
import { useModalStore } from '../../../store/useModalStore.ts';
import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '../../../utils/utils.ts';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ModalWrapperProps {
  renderContent: (props: {
    modalOpen: boolean;
    setModalOpen: (open: boolean) => void;
  }) => React.ReactNode;
  /** Used for accessibility, not visually shown */
  title: string;
  onDismiss?: () => void;
  // Modals without triggers are initially toggled programmatically
  children?: React.ReactNode;
  disabled?: boolean;
  // Override Modal internal state with external value
  externalModalOpenState?: boolean;
  showCloseButton?: boolean;
  closeButtonClassName?: string;
  centerContents?: boolean;
}

export const ModalWrapperBase = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'aw-flex aw-size-full aw-flex-col aw-gap-y-3 aw-overflow-auto aw-p-4 aw-scrollbar aw-scrollbar-track-accent/70 aw-scrollbar-thumb-text-primary/80',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const ModalWrapper = ({
  children: trigger,
  title,
  renderContent,
  disabled,
  onDismiss,
  externalModalOpenState,
  showCloseButton = true,
  closeButtonClassName,
  centerContents,
}: ModalWrapperProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { modalContainer } = useModalStore((state) => ({
    modalContainer: state.modalContainer,
  }));

  useEffect(() => {
    if (externalModalOpenState !== undefined) {
      setModalOpen(externalModalOpenState);
    }
  }, [externalModalOpenState]);

  const setModalState = useCallback(
    (open: boolean) => {
      if (open) {
        setModalOpen(true);
      } else {
        onDismiss?.();
        setModalOpen(false);
      }
    },
    [onDismiss],
  );

  return (
    <Dialog.Root open={modalOpen} onOpenChange={setModalState} modal={false}>
      {trigger && (
        <Dialog.Trigger
          className={cn({ 'aw-cursor-not-allowed': disabled })}
          disabled={disabled}
        >
          {trigger}
        </Dialog.Trigger>
      )}
      <Dialog.Portal container={modalContainer}>
        <Dialog.Content
          onInteractOutside={(event) => {
            // Prevent closing modal when clicking outside the modal
            event.preventDefault();
          }}
          onEscapeKeyDown={(event) => {
            if (!showCloseButton) {
              event.preventDefault();
            }
          }}
          aria-describedby={undefined}
          className={'aw-pointer-events-auto aw-size-full'}
        >
          <div className="aw-relative aw-flex aw-size-full aw-animate-fade-in aw-rounded-[10px] aw-bg-primaryDark aw-text-text-primary">
            {showCloseButton && (
              <Dialog.Close aria-label="Close">
                <CloseButton className={closeButtonClassName} />
              </Dialog.Close>
            )}
            <VisuallyHidden>
              <Dialog.Title>{title}</Dialog.Title>
            </VisuallyHidden>
            <ModalWrapperBase
              className={
                centerContents ? 'aw-items-center aw-justify-center' : ''
              }
            >
              {renderContent({ modalOpen, setModalOpen: setModalState })}
            </ModalWrapperBase>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
