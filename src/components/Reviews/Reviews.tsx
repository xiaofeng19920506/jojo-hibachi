import React, { useRef, useState } from "react";
import {
  Container,
  ReviewSection,
  ReviewHeader,
  GoogleBadge,
  ReviewList,
  ReviewCard,
  ReviewRating,
  ReviewText,
  Reviewer,
  ReviewDate,
  Dots,
  Dot,
  PhotoGrid,
  PhotoItem,
} from "./elements";
import Logo from "../../asset/logo.png";

const reviews = [
  {
    name: "Briana Renee",
    date: "June 26, 2025",
    text: "It was my birthday 🥳🎉 I enjoyed everything, the food was great! I would do this experience again! Thank you Andy for such an amazing experience",
    rating: 5,
  },
  {
    name: "Ourika Johnson",
    date: "June 26, 2025",
    text: "Best service and Food. Andy was Great can’t wait to book again.",
    rating: 5,
  },
];

const galleryImages = [
  Logo,
  Logo,
  Logo,
  Logo,
  Logo,
  Logo,
  Logo,
  Logo,
  Logo,
  Logo,
];

const Reviews: React.FC = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    if (listRef.current) {
      const cardWidth = listRef.current.clientWidth;
      listRef.current.scrollTo({ left: index * cardWidth, behavior: "smooth" });
    }
  };

  return (
    <Container>
      <ReviewSection>
        <ReviewHeader>
          <img src={Logo} alt="Review header" />
          <div>
            <h2>hibachisakeke</h2>
            <GoogleBadge>
              Google Rating ★★★★★<span> Based on 240 Reviews</span>
            </GoogleBadge>
          </div>
        </ReviewHeader>

        <ReviewList ref={listRef}>
          {reviews.map((review, idx) => (
            <ReviewCard key={idx}>
              <ReviewRating>★★★★★</ReviewRating>
              <ReviewText>{review.text}</ReviewText>
              <Reviewer>{review.name}</Reviewer>
              <ReviewDate>{review.date}</ReviewDate>
              <GoogleBadge>Google Review</GoogleBadge>
            </ReviewCard>
          ))}
        </ReviewList>

        <Dots>
          {reviews.map((_, idx) => (
            <Dot
              key={idx}
              active={idx === currentIndex}
              onClick={() => handleDotClick(idx)}
            />
          ))}
        </Dots>
      </ReviewSection>

      <PhotoGrid>
        {galleryImages.map((src, idx) => (
          <PhotoItem key={idx}>
            <img src={src} alt={`gallery-${idx}`} />
          </PhotoItem>
        ))}
      </PhotoGrid>
    </Container>
  );
};

export default Reviews;
