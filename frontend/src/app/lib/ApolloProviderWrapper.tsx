// components/ApolloProviderWrapper.tsx
'use client';

import React from 'react';
import { ApolloProvider } from '@apollo/client';
import apolloclient from './apolloclient'

interface ApolloProviderWrapperProps {
  children: React.ReactNode;
}

const ApolloProviderWrapper: React.FC<ApolloProviderWrapperProps> = ({ children }) => {
  return <ApolloProvider client={apolloclient}>{children}</ApolloProvider>;
};

export default ApolloProviderWrapper;
