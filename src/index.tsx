import ApolloClient, { InMemoryCache } from 'apollo-boost';
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from "react-apollo";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const client = new ApolloClient({
    uri: "https://partyamt.carstens.tech/graphql",
    cache: new InMemoryCache()
  });
  
  
ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
