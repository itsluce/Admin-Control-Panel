import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App.tsx';

async function startApp() {
    if (import.meta.env.DEV) {
        try {
            const {worker} = await import('./mocks/browser');

            const startPromise = worker.start({
                onUnhandledRequest: 'bypass',
                serviceWorker: {
                    url: '/mockServiceWorker.js',
                },
            });

            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('MSW start timeout')), 5000);
            });

            await Promise.race([startPromise, timeoutPromise]);
        } catch (error) {
            console.error(error)
        }
    }

    const rootElement = document.getElementById('root');
    if (!rootElement) {
        throw new Error('Root element not found');
    }

    createRoot(rootElement).render(
        <StrictMode>
            <App/>
        </StrictMode>
    );
}

startApp();
