import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';

export default function ServiceReviewStars({ rating = 0 }) {
  const value = Number(rating || 0);
  const stars = [];

  for (let i = 1; i <= 5; i += 1) {
    if (i <= value) {
      stars.push(<FaStar key={i} style={{ color: '#e6b215' }} />);
    } else if (i - 0.5 <= value) {
      stars.push(<FaStarHalfAlt key={i} style={{ color: '#e6b215' }} />);
    } else {
      stars.push(<FaRegStar key={i} style={{ color: '#d1d5db' }} />);
    }
  }

  return stars;
}
