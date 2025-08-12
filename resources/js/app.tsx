import '../css/app.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Question from './pages/question';
import Landing from './pages/landing';

const el = document.getElementById('app');
const page = el?.getAttribute('data-page');

if (el) {
    ReactDOM.createRoot(el).render(
        <React.StrictMode>
            {page === 'landing' && <Landing />}
            {page === 'question' && <Question />}
        </React.StrictMode>
    );
}
