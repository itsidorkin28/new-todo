import React from 'react';
import './global.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createRoot} from 'react-dom/client'

const element = <>
	<React.StrictMode>
		<App/>
	</React.StrictMode>
</>
const root = createRoot(document.getElementById('root') as Element)
root.render(element)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
