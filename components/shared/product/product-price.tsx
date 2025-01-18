import { cn, formatCurrency } from "@/lib/utils";

const ProductPrice = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => { 
  return (<p className={cn("text-2xl", className)}>
    <span className="text-xs align-super">₹</span>
    {formatCurrency(String(value))}
  </p>);
};

export default ProductPrice;
