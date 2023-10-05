import '@/styles/globals.scss'
import getClient from '../apollo/apolloClient';
import { ApolloProvider } from '@apollo/client'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  const client = getClient();
  return(
    <ApolloProvider client={client}>
   <Component {...pageProps} />
   </ApolloProvider>
  )
}
