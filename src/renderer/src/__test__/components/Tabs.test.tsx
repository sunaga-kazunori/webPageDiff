import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import TabItem from '../../components/TabItem';
import Tabs from '../../components/Tabs';

describe('Tabs', () => {
  const MockTabs: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
      <Tabs activeIndex={activeIndex} setActiveIndex={setActiveIndex}>
        <TabItem label="Tab 1">Content 1</TabItem>
        <TabItem label="Tab 2">Content 2</TabItem>
        <TabItem label="Tab 3">Content 3</TabItem>
      </Tabs>
    );
  };

  it('初期状態の場合、一つ目のタブがアクティブになる', () => {
    render(<MockTabs />);

    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Content 1');
  });

  it('タブをクリックでタブ切り替えが行われる', () => {
    render(<MockTabs />);

    const secondTab = screen.getByRole('tab', { name: 'Tab 2' });
    fireEvent.click(secondTab);

    expect(secondTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Content 2');
  });

  it('左矢印キーでタブ切替が行われる', () => {
    render(<MockTabs />);

    const secondTab = screen.getByRole('tab', { name: 'Tab 2' });

    fireEvent.click(secondTab);
    fireEvent.keyDown(secondTab, { key: 'ArrowLeft' });

    const firstTab = screen.getByRole('tab', { name: 'Tab 1' });

    expect(firstTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Content 1');
  });

  it('右矢印キーでタブ切り替えが行われる', () => {
    render(<MockTabs />);

    const firstTab = screen.getByRole('tab', { name: 'Tab 1' });

    fireEvent.keyDown(firstTab, { key: 'ArrowRight' });

    const secondTab = screen.getByRole('tab', { name: 'Tab 2' });

    expect(secondTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Content 2');
  });

  it('Homeキーで一つ目のタブに切り替えが行われる', () => {
    render(<MockTabs />);

    const secondTab = screen.getByRole('tab', { name: 'Tab 2' });

    fireEvent.click(secondTab);
    fireEvent.keyDown(secondTab, { key: 'Home' });

    const firstTab = screen.getByRole('tab', { name: 'Tab 1' });

    expect(firstTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Content 1');
  });

  it('Endキーで最後のタブに切替が行われる', () => {
    render(<MockTabs />);

    const firstTab = screen.getByRole('tab', { name: 'Tab 1' });

    fireEvent.keyDown(firstTab, { key: 'End' });

    const lastTab = screen.getByRole('tab', { name: 'Tab 3' });

    expect(lastTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Content 3');
  });
});
