
import CardContainer from '../components/ui/Card/CardContainer.jsx';
import CardImage from '../components/ui/Card/CardImage.jsx';
import CardHeader from '../components/ui/Card/CardHeader.jsx';
import CardTitle from '../components/ui/Card/CardTitle.jsx';
import CardSubtitle from '../components/ui/Card/CardSubtitle.jsx';
import CardBody from '../components/ui/Card/CardBody.jsx';
import CardFooter from '../components/ui/Card/CardFooter.jsx';

const Card = {
    Container: CardContainer,
    Image: CardImage,
    Header: CardHeader,
    Title: CardTitle,
    Subtitle: CardSubtitle,
    Body: CardBody,
    Footer: CardFooter
};

export function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

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

export default Card;