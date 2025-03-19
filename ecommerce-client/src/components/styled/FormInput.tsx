import styled from 'styled-components';

const FormInput = styled.input`
	box-sizing: border-box;
	display: block;
	font-weight: bold;
	font-size: 1rem;
	height: 2rem;
	width: 100%;

	padding: 0.5rem;
`;

const FormLabel = styled.label`
	box-sizing: border-box;
	display: block;
	font-weight: bold;
	width: 100%;
	text-align: left;
	margin-top: 1rem;
`;

export { FormInput, FormLabel };
