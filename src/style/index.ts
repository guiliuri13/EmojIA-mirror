import styled from 'styled-components';

export const AppContainer = styled.div`
    margin: 20px auto;
    display: flex;

    .video,
    .debug {
      	padding: 0 20px;
    }

    table.summary {
		border: 1px solid #333;
		border-collapse: collapse;
    }

    table.summary td,
    table.summary th {
		border: 1px solid #333;
		padding: 5px 8px;
    }

    #video-container {
		width: 640px;
		height: 480px;
		position: relative;
    }

    .layer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
    }

    #pose-video {
      	transform: scaleX(-1);
        border-radius: 10px;
    }

    .pose-result {
		font-size: 100px;
		text-align: right;
		padding: 20px 30px 0 0;
    }

    #pose-result-left {
      	text-align: left;
    }
`;