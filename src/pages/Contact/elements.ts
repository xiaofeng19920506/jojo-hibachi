import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

export const FormWrapper = styled.div`
  max-width: 500px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const Header = styled.div`
  text-align: center;
  padding: 3rem 2rem 2rem;
  background: white;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  margin: 0 0 1rem;
  color: #333;
  text-transform: uppercase;
`;

export const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
  font-style: italic;
`;

export const Form = styled.form`
  padding: 0 2rem 2rem;
`;

export const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #333;
  border-radius: 0;
  font-size: 1rem;
  background: transparent;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &::placeholder {
    color: #999;
    font-style: italic;
  }

  &:focus {
    outline: none;
    border-color: #555;
    background: rgba(0, 0, 0, 0.02);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid #333;
  border-radius: 0;
  font-size: 1rem;
  background: transparent;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &::placeholder {
    color: #999;
    font-style: italic;
  }

  &:focus {
    outline: none;
    border-color: #555;
    background: rgba(0, 0, 0, 0.02);
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 1.2rem;
  background: #4a5568;
  color: white;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background: #2d3748;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ContactInfo = styled.div`
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
`;

export const ContactItem = styled.div`
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  color: #333;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ContactLabel = styled.span`
  font-weight: 500;
`;

export const FloatingButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #dc3545;
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
  }
`;