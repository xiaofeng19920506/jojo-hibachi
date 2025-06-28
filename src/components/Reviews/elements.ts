import styled from "styled-components";

export const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const ReviewSection = styled.div`
  margin-bottom: 3rem;
`;

export const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;

  img {
    width: 150px;
    border-radius: 8px;
  }

  h2 {
    margin: 0;
  }

  span {
    display: block;
    font-size: 14px;
    color: gray;
  }
`;

export const GoogleBadge = styled.div`
  font-size: 14px;
  color: #4285f4;
`;

export const ReviewList = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;

  & > div {
    scroll-snap-align: start;
    flex: 0 0 100%;
    box-sizing: border-box;
  }
`;

export const ReviewCard = styled.div`
  background: #f3f3f3;
  padding: 1.5rem;
  margin-right: 1rem;
  border-radius: 8px;
  min-height: 180px;
`;

export const ReviewRating = styled.div`
  font-size: 20px;
  color: #fbc02d;
  margin-bottom: 0.5rem;
`;

export const ReviewText = styled.div`
  font-size: 14px;
  margin-bottom: 1rem;
`;

export const Reviewer = styled.div`
  font-weight: bold;
  font-size: 14px;
`;

export const ReviewDate = styled.div`
  font-size: 12px;
  color: gray;
`;

export const Dots = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

interface DotProps {
  active?: boolean;
}

export const Dot = styled.div<DotProps>`
  width: 10px;
  height: 10px;
  margin: 0 5px;
  border-radius: 50%;
  background: ${({ active }) => (active ? "#4285f4" : "#ccc")};
  cursor: pointer;
`;

export const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
`;

export const PhotoItem = styled.div`
  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
`;
