import React from 'react';
import { Dialog, Flex, Text, ScrollArea } from '@radix-ui/themes';

const MarketDataModal = ({ open, onOpenChange, title, children }) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 600 }}>
        <Dialog.Title>
          <Flex align="center" gap="2">
            {title}
          </Flex>
        </Dialog.Title>
        
        <ScrollArea type="always" scrollbars="vertical" style={{ height: '60vh' }}>
          {children}
        </ScrollArea>
        
        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Text>Закрыть</Text>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default MarketDataModal;
