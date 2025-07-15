import styled from "styled-components";

export const SignInWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: #f0f2f5;
`;

export const Form = styled.form`
  background: white;
  padding: 3.5rem 2.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 50%;
  max-width: 30rem;
  display: flex;
  flex-direction: column;

  @media (max-width: 600px) {
    width: 100vw;
    height: 100vh;
    max-width: none;
    border-radius: 0;
    box-shadow: none;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

export const Title = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
  color: #333;
`;

export const Input = styled.input`
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  width: 100%;
`;

export const Button = styled.button`
  padding: 0.75rem;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #333;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-align: center;
`;

export const RegisterPrompt = styled.p`
  margin-top: 1rem;
  font-size: 0.9rem;
  text-align: center;
  color: var(--text-color, #fff);
  background-color: inherit;

  a {
    color: #0077cc;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;
