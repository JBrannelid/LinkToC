import CardBody from "../components/ui/card/CardBody.jsx";
import CardContainer from "../components/ui/card/CardContainer.jsx";
import CardFooter from "../components/ui/card/CardFooter.jsx";
import CardHeader from "../components/ui/card/CardHeader.jsx";
import CardImage from "../components/ui/card/CardImage.jsx";
import CardSubtitle from "../components/ui/card/CardSubtitle.jsx";
import CardTitle from "../components/ui/card/CardTitle.jsx";

const Card = {
  Container: CardContainer,
  Image: CardImage,
  Header: CardHeader,
  Title: CardTitle,
  Subtitle: CardSubtitle,
  Body: CardBody,
  Footer: CardFooter,
};
export default Card;
export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Also export individual components
export {
  CardContainer,
  CardImage,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardBody,
  CardFooter,
};
