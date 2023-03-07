import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        outline: 0;
        font-family: 'Roboto', sans-serif;
        user-select: none;
        
        // smooth
        scroll-behavior: smooth;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    html,
    body {
		width: 100%;
		height: 100%;
		overflow: hidden;
		font-family: Arial, sans-serif;
		background-color: #181e2f;
		color: #fff;
    }
	
    body {
		margin: 0;
		padding: 0;
    }
`;
