import React from 'react';
import { createRoot } from 'react-dom/client';
import LearningPage from '@/pages/LearningPage';

// Initialize the learning app
window.initLearningApp = () => {
    const container = document.getElementById('learning-app');
    if (container) {
        const root = createRoot(container);
        root.render(<LearningPage />);
    }
};

// Auto-initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initLearningApp);
} else {
    window.initLearningApp();
}