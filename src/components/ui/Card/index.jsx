
import CardContainer from './Card';
import CardImage from './CardImage';
import CardHeader from './CardHeader';
import CardTitle from './CardTitle';
import CardSubtitle from './CardSubtitle';
import CardBody from './CardBody';
import CardFooter from './CardFooter';

const Card = {
    Container: CardContainer,
    Image: CardImage,
    Header: CardHeader,
    Title: CardTitle,
    Subtitle: CardSubtitle,
    Body: CardBody,
    Footer: CardFooter
};

export default Card;

// Also export individual components
export {
    CardContainer,
    CardImage,
    CardHeader,
    CardTitle,
    CardSubtitle,
    CardBody,
    CardFooter
};