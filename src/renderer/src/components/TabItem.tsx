import { ReactNode } from 'react';

type Props = {
  label: string;
  children: ReactNode;
};

const TabItem: React.FC<Props> = ({ children }: Props) => {
  return <>{children}</>;
};

export default TabItem;
