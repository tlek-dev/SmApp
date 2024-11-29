import React from 'react';
import { Box, Flex, Text, Link } from '@radix-ui/themes';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      style={{
        borderTop: '1px solid var(--gray-4)',
        marginTop: 'auto',
        paddingTop: '24px',
        paddingBottom: '24px',
        background: 'var(--gray-1)',
      }}
    >
      <Flex
        direction="column"
        align="center"
        gap="3"
        style={{
          textAlign: 'center',
        }}
      >
        <Text size="2" color="gray">
          © {currentYear} Company Name
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
