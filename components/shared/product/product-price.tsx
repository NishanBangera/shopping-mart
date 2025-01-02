import { cn, formatNumberWithComma } from "@/lib/utils";

const ProductPrice = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => { 
  return (<p className={cn("text-2xl", className)}>
    <span className="text-xs align-super">₹</span>
    {formatNumberWithComma(String(value))}
  </p>);
};

export default ProductPrice;
