import React, { Dispatch, ReactNode, SetStateAction, useEffect, useMemo, useRef } from 'react';

type Props = {
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  children: ReactNode;
};

const Tabs: React.FC<Props> = ({ children, activeIndex, setActiveIndex }: Props) => {
  const randomString = useMemo(() => `tab-${crypto.randomUUID()}`, []);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isInitialRender = useRef(true);
  const handleClick = (index: number): void => {
    setActiveIndex(index);
  };
  const handleKeydown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
    const lastIndex = React.Children.count(children) - 1;

    switch (e.key) {
      case 'ArrowLeft':
        setActiveIndex((prevIndex) => (prevIndex === 0 ? lastIndex : prevIndex - 1));
        break;

      case 'ArrowRight':
        setActiveIndex((prevIndex) => (prevIndex === lastIndex ? 0 : prevIndex + 1));
        break;

      case 'Home':
        setActiveIndex(0);
        break;

      case 'End':
        setActiveIndex(lastIndex);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    // 初回レンダリングではフォーカスを当てない
    if (isInitialRender.current) {
      isInitialRender.current = false;
    } else if (tabRefs.current[activeIndex]) {
      tabRefs.current[activeIndex]?.focus();
    }
  }, [activeIndex]);

  const tabs = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) {
      return null;
    }

    const buttonId = `${randomString}-${index}`;

    return (
      <button
        id={buttonId}
        type="button"
        role="tab"
        tabIndex={activeIndex === index ? 0 : -1}
        aria-controls={randomString}
        key={buttonId}
        onClick={() => handleClick(index)}
        onKeyDown={handleKeydown}
        ref={(element) => (tabRefs.current[index] = element)}
        aria-selected={activeIndex === index ? 'true' : 'false'}
        className={`px-4 py-2 rounded-t-lg border-b-2 w-2/4 font-bold cursor-pointer ${
          activeIndex === index
            ? 'border-blue-500 text-blue-500'
            : 'border-transparent text-gray-500 hover:text-blue-500'
        }`}
      >
        {child.props.label}
      </button>
    );
  });

  return (
    <div className="pb-6 border-b border-gray-400 mb-6">
      <div className="flex space-x-2 border-b mb-4" role="tablist">
        {tabs}
      </div>

      <div id={randomString} role="tabpanel" aria-labelledby={`${randomString}-${activeIndex}`}>
        {React.Children.toArray(children)[activeIndex]}
      </div>
    </div>
  );
};

export default Tabs;
