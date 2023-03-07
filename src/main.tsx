import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import GlobalTheme from './style/Global';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <GlobalTheme />
        <App />
    </React.StrictMode>,
)
