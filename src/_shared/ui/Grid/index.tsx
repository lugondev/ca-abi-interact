import { TSize, TWithChildren, TWithSize } from "@shared/lib/props";
import { cn } from "@/lib/utils";

export const Row = ({ children }: TWithChildren) => (
  <div className="grid grid-cols-1 gap-2">{children}</div>
);

export const Col = ({
  children,
  share = 2,
}: TWithChildren & { share?: number }) => (
  <div className={cn(share === 1 && "col-span-1")}>{children}</div>
);

export const Col1 = ({ children }: TWithChildren) => (
  <Col share={1}>{children}</Col>
);

export const Col2 = ({ children }: TWithChildren) => (
  <Col share={2}>{children}</Col>
);

export const Col3 = ({ children }: TWithChildren) => (
  <Col share={3}>{children}</Col>
);

const sizeToGap = (size: TSize): string => {
  return {
    large: "gap-6",
    medium: "gap-4",
    small: "gap-2",
  }[size];
};

export const FlexVertical = ({ children, size }: TWithChildren & TWithSize) => {
  return (
    <div className={cn("flex flex-col w-full", sizeToGap(size || "medium"))}>
      {children}
    </div>
  );
};

export const FlexHorizontal = ({
  children,
  size,
}: TWithChildren & TWithSize) => {
  return (
    <div className={cn("flex items-center w-full", sizeToGap(size || "medium"))}>
      {children}
    </div>
  );
};

