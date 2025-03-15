import React, { ReactNode } from 'react';

type Props = {
  label: string;
  children: ReactNode;
};

const TabItem: React.FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default TabItem;
