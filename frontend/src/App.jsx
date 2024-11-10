import React from 'react';
import Transcriptor from './Transcriptor';
import SimilarDocumentsFinder from './SimilarDocumentsFinder';

const App = () => {

  return (
    <div>
        <h1>Hello, JSX!</h1>
        <p>This is a component using JSX syntax.</p>
        <Transcriptor />
        <SimilarDocumentsFinder />
    </div>
  );
}

export default App