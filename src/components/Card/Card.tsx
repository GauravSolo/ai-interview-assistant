import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import styles from "./Card.module.css";

interface CardsProps {
  title: string;
  description: string;
  selected: boolean;
  onClick:()=>void;
}

const Cards: React.FC<CardsProps> = ({ title, description, selected = false, onClick}) => {
  return (
    <Card className={`w-[350px] shadow-md hover:shadow-lg transition border-[2px] cursor-pointer ${selected?styles.selected:''}`} onClick={onClick}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default Cards;
